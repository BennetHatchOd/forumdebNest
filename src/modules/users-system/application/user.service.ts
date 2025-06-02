import { Inject, Injectable } from '@nestjs/common';
import { PasswordHashService } from './password.hash.service';
import { add, isBefore } from 'date-fns';
import { UserAboutViewDto } from '../dto/view/user.about.view.dto';
import { UserConfig } from '../config/user.config';
import { INJECT_TOKEN } from '@core/constans/jwt.tokens';
import { JwtService } from '@nestjs/jwt';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { NewPasswordInputDto } from '@src/modules/users-system/dto/input/new.password.input.dto';
import { UserRepository } from '@modules/users-system/infrastucture/user.repository';
import { UserEntityAssociated } from '@modules/users-system/dto/user.entity.associated';
import { v4 as uuidv4 } from 'uuid';
import { CreateCodeDto } from '@modules/users-system/dto/create/create.code.dto';
import { EmailService } from '@modules/notifications/application/email.service';

@Injectable()
export class UserService {
    constructor(
        @Inject(INJECT_TOKEN.ACCESS_TOKEN)
        private readonly accessJwtService: JwtService,
        private readonly userRepository: UserRepository,
        private readonly mailService: EmailService,
        private readonly passwordHashService: PasswordHashService,
        private readonly userConfig: UserConfig,
    ) {}

    async createAccessToken(userId: number) {


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


    async resetPassword(email: string): Promise<void> {
        // Only for verified users!
        // Generates a new recovery code and sends it via email without deleting the previous ones.
        // Delete the old codes ONLY after any of the codes are triggered.

        let foundedUser: number | null =
            await this.userRepository.findUserIdByEmail(email);
        if (!foundedUser)
            return;
        // Even if the current email address is not registered,
        // do not throw an error (to prevent detection of the user's email address)

        const code = uuidv4();
        const expirationTime = add(new Date(), {hours: this.userConfig.timeLifePasswordCode});
        const resetPasswordDto = new CreateCodeDto(foundedUser, code, expirationTime);
        await this.userRepository.saveResetPasswordCode(resetPasswordDto);
        this.mailService.createPasswordRecovery(email, code);
        return;
    }

    async setNewPassword(recoveryPassword: NewPasswordInputDto): Promise<void> {
        // Sets a new password if a valid recovery code was received

        const userNewPassword: UserEntityAssociated|null =
            await this.userRepository.findResetPasswordCode(recoveryPassword.recoveryCode);

        if (!userNewPassword || isBefore(userNewPassword.entityExpiredTime, new Date()))
            throw new DomainException({
                message: "a valid recovery code wasn't received or expired",
                code: DomainExceptionCode.PasswordRecoveryCodeNotFound,
                extension: [{message: "a valid recovery code wasn't received or expired",
                            field: "recoveryCode"}]
            });

        const hash: string = await this.passwordHashService.createHash(
            recoveryPassword.newPassword,
            this.userConfig.saltRound,
        );
        userNewPassword.passwordHash = hash;
        const user = userNewPassword.mapToUser()
        await this.userRepository.saveUser(user);

        return;
    }

    async aboutMe(userId: string): Promise<UserAboutViewDto> {
        const user = (await this.userRepository.findById(userId));
        const userView = UserAboutViewDto.mapToView(user!);
        return userView;
    }
}
