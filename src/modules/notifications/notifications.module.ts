import { Module } from '@nestjs/common';
import { MailService } from './application/mail.service';
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
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class NotificationsModule {}

