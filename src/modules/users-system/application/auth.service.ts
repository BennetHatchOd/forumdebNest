import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../infrastucture/auth.repository';
import { PasswordHashService } from './password.hash.service';
import { JwtService } from '@nestjs/jwt';
import {v4 as uuidv4} from 'uuid';
import {add, isBefore} from 'date-fns';
import { PASSCODE_ADMIN_NAME, PASSCODE_ADMIN_PASSWORD, TIME_LIFE_EMAIL_CODE } from '../../../core/setting';
import { UserInputDto } from '../dto/input/user.input.dto';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { NewPassword, NewPasswordDocument, NewPasswordModelType } from '../domain/new.password';
import { UserRepository } from '../infrastucture/user.repository';
import { UserAboutViewDto } from '../dto/view/user.about.view.dto';
import { MailService } from '../../notifications/application/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly passwordHashService: PasswordHashService,
        private readonly mailService: MailService,
        @InjectModel(User.name) private UserModel: UserModelType,
        @InjectModel(NewPassword.name) private NewPasswordModel: NewPasswordModelType,
    ) {}

    async authorization(userId: string) {
        const payload = { sub: userId };
        return this.jwtService.sign(payload)
    }

    async validateUserForLocal(loginOrEmail: string, passHash: string):Promise<string|null> {
        // проверяет по полям логин И емайл пользователя, если он найден,
        // проверяет совпадение хеша пароля и
        // возвращает ид найденного пользователя
        const foundUser: {id:string, passHash:string} | null
            = await this.authRepository.getPartUserByLoginEmail(loginOrEmail);

        if(foundUser !== null && await this.passwordHashService.checkHash(passHash, foundUser.passHash))
            return foundUser.id

        return null;
    }

    async validateUserForBasic(login: string, password: string):Promise<boolean> {
        // проверяет по authHeader поля логин и пароль пользователя,

        return (login === PASSCODE_ADMIN_NAME && password === PASSCODE_ADMIN_PASSWORD);
    }

    async registrationUser(inputUserDto: UserInputDto): Promise<void> {

        const checkUniq: string[] | null
            = await this.authRepository.checkUniq(inputUserDto.login, inputUserDto.email)

        if(checkUniq) {
            throw new BadRequestException("user's email or login must be uniq");
        }
        const passwordHash: string = await this.passwordHashService.createHash(inputUserDto.password)

        const createdUser: UserDocument = this.UserModel.createInstance({
                                                                        ...inputUserDto,
                                                                        password: passwordHash,});
        createdUser.confirmEmail = {
                code: uuidv4(),
                expirationTime: add(new Date(), { hours: TIME_LIFE_EMAIL_CODE}),
        }

        await this.mailService.createConfirmEmail(inputUserDto.email, createdUser.confirmEmail.code)

        await this.authRepository.save(createdUser);
        return;
    }

    async confirmationUser(code: string):Promise<void> {
        const foundUser: UserDocument|null = await this.authRepository.findByConfirmCode(code)

        if (!foundUser || isBefore(foundUser.confirmEmail.expirationTime, new Date())){
            throw new BadRequestException("the confirmation code is incorrect, expired or already been applied");
        }
        foundUser.isConfirmEmail = true;

        await this.authRepository.save(foundUser)

        return ;
    }

    async reSendEmail(email: string): Promise<void> {
        // for a user with an unconfirmed email,
        // sends a letter with a new confirmation code

        let userWithOutMail: UserDocument | null = await this.authRepository.foundUserWithOutEmail(email)

        if(!userWithOutMail) {
            throw new BadRequestException("user with not verifed email not found")
        }
        userWithOutMail.confirmEmail = {
            code: uuidv4(),
            expirationTime: add(new Date(), { hours: TIME_LIFE_EMAIL_CODE}),
        }

        await this.mailService.createConfirmEmail(email, userWithOutMail.confirmEmail.code)

        await this.authRepository.save(userWithOutMail);
        return;
    }

    async askNewPassword(email: string): Promise<void> {
        // Only for verified users!
        // Generates a new recovery code and sends it via email without deleting the previous ones.
        // Delete the old codes ONLY after any of the codes are triggered.

        let foundedUser: string | null = await this.authRepository.foundUserIdByEmail(email)
        if(!foundedUser) {
            throw new BadRequestException("user with not verifed email not found")
        }

        const newPassword: NewPasswordDocument = this.NewPasswordModel.createInstance(foundedUser)
        await this.authRepository.save(newPassword);

        await this.mailService.createPasswordRecovery(email, newPassword.code)

        return;
    }

    async setNewPassword(newPassword: string, recoveryCode: string):Promise<void> {
        // Sets a new password if a valid recovery code was received

        const newPasswordObj:NewPasswordDocument|null
            = await this.authRepository.findPasswordRecovery(recoveryCode)

        if(!newPasswordObj || isBefore(newPasswordObj.expirationTime, new Date())){
            throw new BadRequestException("a valid recovery code wasn't received")
        }

        const hash: string = await this.passwordHashService.createHash(newPassword);
        const user: UserDocument = await this.userRepository.findById(newPasswordObj.id) as UserDocument;
        user.passwordHash = hash;
        await this.authRepository.save(user);

        await this.authRepository.deletePasswordRecovery(newPasswordObj.userId)

        return;
    }

    async aboutMe(userId: string): Promise<UserAboutViewDto> {
        const user = await this.userRepository.findById(userId) as UserDocument;
        const userView = UserAboutViewDto.mapToView(user);
        return userView;
    }
}
