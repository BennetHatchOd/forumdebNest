import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UserControllers } from './api/user.controller';
import { UserService } from './application/user.service';
import { UserQueryRepository } from './infrastucture/query/user.query.repository';
import { UserRepository } from './infrastucture/user.repository';
import { AuthController } from './api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../core/strategy/local.strategy';
import { PasswordHashService } from './application/password.hash.service';
import { AuthService } from './application/auth.service';
import { AuthRepository } from './infrastucture/auth.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../../core/strategy/jwt.strategy';
import { myBasicStrategy } from '../../core/strategy/basic.strategy';
import { NewPassword, NewPasswordSchema } from './domain/new.password';
import { TokenService } from './application/token.service';
import { UserConfig } from './config/user.config';
import { MailService } from '../notifications/application/mail.service';
import { UserQueryExternalRepository } from './infrastucture/query/user.query.external.repository';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: NewPassword.name, schema: NewPasswordSchema },
        ]),
        PassportModule,
        JwtModule.register({}),
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
        TokenService,
        LocalStrategy,
        JwtStrategy,
        myBasicStrategy,
        JwtService,
        ConfigService,
    ],
    exports:[
        UserQueryExternalRepository,
    ]
})
export class UserSystemModule {}
