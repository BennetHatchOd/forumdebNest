import { Module } from '@nestjs/common';

import { UserControllers } from './api/user.controller';
import { AuthController } from './api/auth.controller';
import { DeviceController } from '@modules/users-system/api/device.controller';

import { UserRepository } from '@modules/users-system/infrastucture/user.repository';
import { UserQueryRepository } from './infrastucture/query/user.query.repository';
import { UserQueryExternalRepository } from './infrastucture/query/user.query.external.repository';
import { SessionRepository } from '@modules/users-system/infrastucture/session.repository';
import { SessionQueryRepository } from '@modules/users-system/infrastucture/query/session.query.repository';

import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '@core/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '@core/auth.module';

import { LocalStrategy } from '@src/core/strategy/local.strategy';
import { JwtStrategy } from '@src/core/strategy/jwt.strategy';
import { myBasicStrategy } from '@src/core/strategy/basic.strategy';

import { PasswordHashService } from './application/password.hash.service';
import { UserService } from './application/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../notifications/application/email.service';

import { INJECT_TOKEN } from '@core/constans/jwt.tokens';
import { CommandHandlers } from '@modules/users-system/application/UseCase';
import { UserConfig } from './config/user.config';
import { ThrottlerOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        DatabaseModule,
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
        UserRepository,
        UserConfig,
        UserQueryRepository,
        UserQueryExternalRepository,
        UserRepository,
        UserService,
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
