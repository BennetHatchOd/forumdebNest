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
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@src/core/strategy/jwt.strategy';
import { myBasicStrategy } from '@src/core/strategy/basic.strategy';
import { NewPassword, NewPasswordSchema } from './domain/new.password';
import { UserConfig } from './config/user.config';
import { EmailService } from '../notifications/application/email.service';
import { UserQueryExternalRepository } from './infrastucture/query/user.query.external.repository';
import { ConfigService } from '@nestjs/config';
import { INJECT_TOKEN } from '@core/constans/jwt.tokens';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from '@modules/users-system/application/UseCase';
import { AuthModule } from '@core/auth.module';
import { SessionRepository } from '@modules/users-system/infrastucture/session.repository';
import { Session, SessionSchema } from '@modules/users-system/domain/session.entity';
import { SessionQueryRepository } from '@modules/users-system/infrastucture/query/session.query.repository';
import { DeviceController } from '@modules/users-system/api/device.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '@core/database.module';
import { ThrottlerOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';
//import { UserSQLRepository } from '@modules/users-system/infrastucture/user.sql.repository';

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        DatabaseModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Session.name, schema: SessionSchema },
            { name: NewPassword.name, schema: NewPasswordSchema },
        ]),
        ThrottlerModule.forRootAsync({
            imports:[UserSystemModule],
            inject: [UserConfig],
            useFactory: (userConfig:UserConfig):ThrottlerOptions[] => {
                return[ {
                    ttl:userConfig.timeRateLimiting,
                    limit:userConfig.countRateLimiting
                } ] as ThrottlerOptions[]},
        }),
        JwtModule,
        PassportModule,
    ],
    controllers: [
        UserControllers,
        AuthController,
        DeviceController,
    ],
    providers: [
        ...CommandHandlers,
//        UserSQLRepository,
        UserService,
        UserConfig,
        UserQueryRepository,
        UserQueryExternalRepository,
        UserRepository,
        AuthService,
        AuthRepository,
        PasswordHashService,
        EmailService,
        LocalStrategy,
        JwtStrategy,
        myBasicStrategy,
        ConfigService,
        SessionRepository,
        SessionQueryRepository,
        // {
        //     provide: INJECT_TOKEN.ACCESS_TOKEN,
        //     useFactory: (userConfig: UserConfig): JwtService => {
        //         return new JwtService({
        //             secret: userConfig.accessTokenSecret,
        //             signOptions: { expiresIn: userConfig.timeLifeAccessToken },
        //         });
        //     },
        //     inject: [UserConfig],
        // },
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
        UserQueryExternalRepository,UserConfig,
    ]
})
export class UserSystemModule {}
