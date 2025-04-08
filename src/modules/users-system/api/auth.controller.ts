import { Body, Controller, Post, UseGuards, Request, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AUTH_PATH, URL_PATH } from '../../../core/setting';
import { AuthService } from '../application/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInputDto } from '../dto/input/user.input.dto';
import { UserAboutViewDto } from '../dto/view/user.about.view.dto';

@Controller(URL_PATH.auth)
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post(AUTH_PATH.login)
    @UseGuards(AuthGuard('local'))
    async authorization(@Request() userId: string):Promise<{accessToken: string}>{

         const userTokens: string = await this.authService.authorization(userId)

          return {
              accessToken: userTokens};
    }

    @Post(AUTH_PATH.registration)
    @HttpCode(HttpStatus.NO_CONTENT)
    async registration(@Body() inputUserDto: UserInputDto) : Promise<void> {

            return await this.authService.registrationUser(inputUserDto)
    }

    @Post(AUTH_PATH.confirmation)
    @HttpCode(HttpStatus.NO_CONTENT)
    async confirmation(@Body() code: string): Promise<void> {

            return  await this.authService.confirmationUser(code);
    }

    @Post(AUTH_PATH.resentEmail)
    @HttpCode(HttpStatus.NO_CONTENT)
    async reSendMail(@Body() email: string): Promise<void> {

            return  await this.authService.reSendEmail(email)
    }

    @Post(AUTH_PATH.askNewPassword)
    @HttpCode(HttpStatus.NO_CONTENT)
    async askNewPassword(@Body() email:string):Promise<void> {

            return await this.authService.askNewPassword(email)
    }

    @Post(AUTH_PATH.confirmNewPassword)
    @HttpCode(HttpStatus.NO_CONTENT)
    async resentPassword(@Body()newPassword: string, recoveryCode: string):Promise<void> {

            return await this.authService.setNewPassword(newPassword, recoveryCode)
    }

    @Get(AUTH_PATH.aboutMe)
    @UseGuards(AuthGuard('jwt'))
    async getMe(@Request() userId: string): Promise<UserAboutViewDto>{

            const answer: UserAboutViewDto = await this.authService.aboutMe(userId)
            return answer;
    }

}
