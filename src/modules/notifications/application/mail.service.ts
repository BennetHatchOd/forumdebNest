import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}


    async createConfirmEmail(mail: string, code: string): Promise<void>{
        const message =
            `<h1>Thanks for your registration</h1>
          <p> To finish registration please follow the link below:
              <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
          </p>`

        await this.mailerService.sendMail({
            to: mail,
            subject: 'registration confirmation',
            html: message})
    }

    async createPasswordRecovery(mail: string, code: string): Promise<void>{
        const message =
            `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
        </p>`
        await this.mailerService.sendMail({
            to: mail,
            subject: 'password-recovery',
            html: message})
    }
}
