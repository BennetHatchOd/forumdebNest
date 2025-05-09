import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInputDto } from '../dto/input/user.input.dto';
import { AUTH_PATH, URL_PATH } from '@core/url.path.setting';
import { EmailInputDto } from '@src/modules/users-system/dto/input/email.input.dto';
import { ConfirmCodeInputDto } from '@src/modules/users-system/dto/input/confirm.code.input.dto';
import { NewPasswordInputDto } from '@src/modules/users-system/dto/input/new.password.input.dto';
import { CurrentUserId } from '@core/decorators/current.user';
import { UserAboutViewDto } from '../dto/view/user.about.view.dto';
import console from 'node:console';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@modules/users-system/application/UseCase/create.user.usecase';

@Controller(URL_PATH.auth)
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly commandBus: CommandBus,
        ) {
    }

    @Post(AUTH_PATH.login)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('local'))
    async authorization(@CurrentUserId() userId: string):Promise<{accessToken: string}>{

        const userTokens: string = await this.authService.authorization(userId)
        return {
            accessToken: userTokens};
    }

    @Post(AUTH_PATH.registration)
    @HttpCode(HttpStatus.NO_CONTENT)
    async registration(@Body() inputUserDto: UserInputDto) : Promise<void> {

        await this.commandBus.execute(new CreateUserCommand(inputUserDto, false));
        return;
    }

    @Post(AUTH_PATH.confirmation)
    @HttpCode(HttpStatus.NO_CONTENT)
    async confirmation(@Body() inputCode: ConfirmCodeInputDto): Promise<void> {

            return  await this.authService.confirmationEmail(inputCode.code);
    }

    @Post(AUTH_PATH.resentEmail)
    @HttpCode(HttpStatus.NO_CONTENT)
    async reSendMail(@Body() inputEmail:EmailInputDto): Promise<void> {

        return  await this.authService.reSendEmail(inputEmail.email)
    }

    @Post(AUTH_PATH.askNewPassword)
    @HttpCode(HttpStatus.NO_CONTENT)
    async askNewPassword(@Body() inputEmail:EmailInputDto):Promise<void> {
            return await this.authService.askNewPassword(inputEmail.email)
    }

    @Post(AUTH_PATH.confirmNewPassword)
    @HttpCode(HttpStatus.NO_CONTENT)
    async resentPassword(@Body()recoveryPassport: NewPasswordInputDto):Promise<void> {

            return await this.authService.setNewPassword(recoveryPassport)
    }

    @Get(AUTH_PATH.aboutMe)
    @UseGuards(AuthGuard('jwt'))
    async getMe(@CurrentUserId() user: string)//: Promise<UserAboutViewDto>
     {
               const answer: UserAboutViewDto = await this.authService.aboutMe(user)
            return answer;
    }

    // @Get(AUTH_PATH.logout)
    // @UseGuards(AuthGuard(?))
    // async logOut(@CurrentUserId() userId: string): Promise<>{}

    // @Get(AUTH_PATH.refresh)
    // @UseGuards(AuthGuard(?))
    // async newRefreshToken(@CurrentUserId() userId: string): Promise<>{
    // }
}

