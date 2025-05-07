import { Module } from '@nestjs/common';
import { EmailService } from './application/email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        secure: false,
        auth: {
          user: 'vng114.work@gmail.com',
          pass: 'PASSWORD_MAIL',
        },
      },
      defaults: {
        from: '"No Reply" <vng114.work@gmail.com>',
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService], // 👈 export for DI
})
export class NotificationsModule {}

