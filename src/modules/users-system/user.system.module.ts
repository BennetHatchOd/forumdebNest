import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UserControllers } from './api/user.controller';
import { UserService } from './application/user.service';
import { UserQueryRepository } from './infrastucture/query/user.query.repository';
import { UserRepository } from './infrastucture/user.repository';
import { AuthController } from './api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { PasswordHashService } from './application/password.hash.service';
import { AuthService } from './application/auth.service';
import { AuthRepository } from './infrastucture/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_KEY } from '../../core/setting';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { myBasicStrategy } from './strategy/basic.strategy';
import { NewPassword, NewPasswordSchema } from './domain/new.password';
import { TokenService } from './application/token.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: NewPassword.name, schema: NewPasswordSchema },
        ]),
        PassportModule,
        JwtModule.register({}),
        NotificationsModule,
    ],
    controllers: [
        UserControllers,
        AuthController,
    ],
    providers: [
        UserService,
        AuthService,
        UserQueryRepository,
        UserRepository,
        AuthRepository,
        PasswordHashService,
        LocalStrategy,
        JwtStrategy,
        myBasicStrategy,
        TokenService
    ],
})
export class UserSystemModule {}
