import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AUTH_PATH } from '../../../core/setting';
import { UserInputDto } from '../dto/input/user.input.dto';
import { UserAboutViewDto } from '../dto/view/user.about.view.dto';
import { LoginInputDto } from '../dto/input/login.input.dto';
import { AuthService } from '../apllication/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }
    @Post(AUTH_PATH.login)
    async authorization(@Body() loginDto: LoginInputDto){

         const userTokens: string = await this.authService.authorization(loginDto)

          return userTokens;
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
    async getMe(@Param() accessToken: string): Promise<UserAboutViewDto>{

            const answer: UserAboutViewDto = await this.authService.aboutMe(accessToken))
            return answer;
    }

}
