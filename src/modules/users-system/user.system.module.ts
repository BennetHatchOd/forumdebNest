import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UserControllers } from './api/user.controller';
import { UserService } from './apllication/user.service';
import { UserQueryRepository } from './infrastucture/query/user.query.repository';
import { UserRepository } from './infrastucture/user.repository';
import { AuthController } from './api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { PasswordHashService } from './apllication/password.hash.service';
import { AuthService } from './apllication/auth.service';
import { AuthRepository } from './infrastucture/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_KEY } from '../../core/setting';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }, ]),
        PassportModule,
        JwtModule.register({
            secret: SECRET_KEY,
            signOptions: { expiresIn: '5m' },
        }),
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
        // JwtStrategy,
        // BasicStrategy
    ],
})
export class UserSystemModule {}
