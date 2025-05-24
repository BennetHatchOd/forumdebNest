import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '../infrastucture/auth.repository';
import { PasswordHashService } from './password.hash.service';
import { isBefore} from 'date-fns';
import { UserInputDto } from '../dto/input/user.input.dto';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { NewPassword, NewPasswordDocument, NewPasswordModelType } from '../domain/new.password';
import { UserRepository } from '../infrastucture/user.repository';
import { UserAboutViewDto } from '../dto/view/user.about.view.dto';
import { EmailService } from '../../notifications/application/email.service';
import { UserConfig } from '../config/user.config';
import { INJECT_TOKEN } from '@core/constans/jwt.tokens';
import { JwtService } from '@nestjs/jwt';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { NewPasswordInputDto } from '@src/modules/users-system/dto/input/new.password.input.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(INJECT_TOKEN.ACCESS_TOKEN)
        private readonly accessJwtService: JwtService,
        @Inject(INJECT_TOKEN.REFRESH_TOKEN)
        private readonly refreshJwtService: JwtService,
        private readonly authRepository: AuthRepository,
        private readonly userRepository: UserRepository,
        private readonly passwordHashService: PasswordHashService,
        private readonly mailService: EmailService,
        private readonly userConfig: UserConfig,
        @InjectModel(User.name) private UserModel: UserModelType,
        @InjectModel(NewPassword.name)
        private NewPasswordModel: NewPasswordModelType,
    ) {}

    async authorization(userId: string) {


        return this.accessJwtService.sign({ user: userId });
    }

    async validateUserForLocalAuth(
        loginOrEmail: string,
        passHash: string,
    ): Promise<string | null> {
        // проверяет по полям логин И емайл пользователя, если он найден,
        // проверяет совпадение хеша пароля и
        // возвращает ид найденного пользователя
        const foundUser: { id: string; passHash: string } | null =
            await this.userRepository.getPartUserByLoginEmail(loginOrEmail);

        if (
            foundUser !== null &&
            (await this.passwordHashService.checkHash(
                passHash,
                foundUser.passHash,
            ))
        )
            return foundUser.id;

        return null;
    }

    async validateUserForBasicAuth(
        login: string,
        password: string,
    ): Promise<boolean> {
        // проверяет по authHeader поля логин и пароль пользователя,

        return (
            login === this.userConfig.adminNameBasicAuth &&
            password === this.userConfig.adminPasswordBasicAuth
        );
    }

    async checkUniq (inputUserDto: UserInputDto):Promise<void> {
        const checkUniq: string[] | null = await this.userRepository.checkUniq(
            inputUserDto.login,
            inputUserDto.email,
        );

        if (checkUniq) {
            const errors = checkUniq.map((fieldError:string) => {
                return {
                    message: `user's ${fieldError} must be uniq`,
                    field: fieldError,
                };
            });
            throw new DomainException({
                message: "user's email or login must be uniq",
                code: DomainExceptionCode.ValidationError,
                extension: errors,
            });
        }

        return;
    };

    async confirmationEmail(code: string): Promise<void> {
        const foundUser: UserDocument | null
            = await this.userRepository.findByConfirmCode(code);

        if (!foundUser || !foundUser.confirmationEmail(code))
            throw new DomainException({
                message: "the confirmation code is incorrect, expired or already been applied",
                code: DomainExceptionCode.EmailNotConfirmed,
                extension: [{message: "the confirmation code is incorrect, expired or already been applied",
                            field: "code"}]
            });
        await this.userRepository.save(foundUser);
        return;
    }

    async reSendEmail(email: string): Promise<void> {
        // for users with unconfirmed emails,
        // sends a letter with a new confirmation code

        let userWithoutEmail: UserDocument | null =
            await this.userRepository.foundUserWithOutEmail(email);

        if (!userWithoutEmail) {
            throw new DomainException({
                message: "user with not corfirmed email not found",
                code: DomainExceptionCode.EmailNotExist,
                extension: [{message: "user with not corfirmed email not found",
                    field: "email"}]
            })
        }
        const code: string | null
            = userWithoutEmail.createConfirmCode(this.userConfig.timeLifeEmailCode);

        this.mailService.createNewConfirmEmail(email, code!);
        await this.userRepository.save(userWithoutEmail);
        return;
        // Even if the current email address is not registered or corfirmed,
        // do not throw an error (to prevent detection of the user's email address)

    }

    async askNewPassword(email: string): Promise<void> {
        // Only for verified users!
        // Generates a new recovery code and sends it via email without deleting the previous ones.
        // Delete the old codes ONLY after any of the codes are triggered.

        let foundedUser: string | null =
            await this.userRepository.foundUserIdByEmail(email);
        if (!foundedUser)
            return;
        // Even if the current email address is not registered,
        // do not throw an error (to prevent detection of the user's email address)

        const newPassword: NewPasswordDocument =
            this.NewPasswordModel.createInstance(
                foundedUser,
                this.userConfig.timeLifeEmailCode,
            );
        await this.authRepository.save(newPassword);

        await this.mailService.createPasswordRecovery(email, newPassword.code);

        return;
    }

    async setNewPassword(recoveryPassword: NewPasswordInputDto): Promise<void> {
        // Sets a new password if a valid recovery code was received

        const newPasswordObj: NewPasswordDocument | null =
            await this.authRepository.findPasswordRecovery(recoveryPassword.recoveryCode);

        if (!newPasswordObj)
            throw new DomainException({
                message: "a valid recovery code wasn't received",
                code: DomainExceptionCode.PasswordRecoveryCodeNotFound,
                extension: [{message: "a valid recovery code wasn't received",
                            field: "recoveryCode"}]
            });
        if (isBefore(newPasswordObj.expirationTime, new Date()))
            throw new DomainException({
                message: "a recovery code expired",
                code: DomainExceptionCode.PasswordRecoveryCodeExpired,
                extension: [{message: "a recovery code expired",
                            field: "recoveryCode"}]
            });

        const hash: string = await this.passwordHashService.createHash(
            recoveryPassword.newPassword,
            this.userConfig.saltRound,
        );
        const user: UserDocument = (await this.userRepository.findById(
            newPasswordObj.userId,
        )) as UserDocument;
        user.passwordHash = hash;
        await this.userRepository.save(user);

        await this.authRepository.deleteUsedPasswordRecovery(newPasswordObj.userId);

        return;
    }

    async aboutMe(userId: string): Promise<UserAboutViewDto> {
        const user = (await this.userRepository.findById(
            userId,
        )) as UserDocument;
        const userView = UserAboutViewDto.mapToView(user);
        return userView;
    }
}
