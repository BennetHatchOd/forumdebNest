import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UserControllers } from './api/user.controller';
import { UserService } from './application/user.service';
import { UserQueryRepository } from './infrastucture/query/user.query.repository';
import { UserRepository } from './infrastucture/user.repository';
import { AuthController } from './api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@src/core/strategy/local.strategy';
import { PasswordHashService } from './application/password.hash.service';
import { AuthService } from './application/auth.service';
import { AuthRepository } from './infrastucture/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@src/core/strategy/jwt.strategy';
import { myBasicStrategy } from '@src/core/strategy/basic.strategy';
import { NewPassword, NewPasswordSchema } from './domain/new.password';
import { UserConfig } from './config/user.config';
import { MailService } from '../notifications/application/mail.service';
import { UserQueryExternalRepository } from './infrastucture/query/user.query.external.repository';
import { ConfigService } from '@nestjs/config';
import { INJECT_TOKEN } from '@src/modules/users-system/constans/jwt.tokens';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: NewPassword.name, schema: NewPasswordSchema },
        ]),
        PassportModule,
    ],
    controllers: [
        UserControllers,
        AuthController,
    ],
    providers: [
        UserService,
        UserConfig,
        UserQueryRepository,
        UserQueryExternalRepository,
        UserRepository,
        AuthService,
        AuthRepository,
        PasswordHashService,
        MailService,
        LocalStrategy,
        JwtStrategy,
        myBasicStrategy,
        ConfigService,
        {
            provide: INJECT_TOKEN.ACCESS_TOKEN,
            useFactory: (userConfig: UserConfig): JwtService => {
                return new JwtService({
                    secret: userConfig.accessTokenSecret,
                    signOptions: { expiresIn: userConfig.timeLifeAccessToken },
                });
            },
            inject: [UserConfig],
        },
        {
            provide: INJECT_TOKEN.REFRESH_TOKEN,
            useFactory: (userConfig:UserConfig): JwtService => {
                return new JwtService({
                    secret: userConfig.refreshTokenSecret,
                    signOptions: { expiresIn: userConfig.timeLifeRefreshToken },
                });
            },
            inject: [UserConfig],
        },
    ],
    exports:[
        UserQueryExternalRepository,
    ]
})
export class UserSystemModule {}
