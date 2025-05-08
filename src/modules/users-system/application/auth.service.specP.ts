import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { PasswordHashService } from '../application/password.hash.service';
import { EmailService } from '../../notifications/application/email.service';
import { UserConfig } from '../config/user.config';
import { AuthService } from '@src/modules/users-system/application/auth.service';
import { AuthRepository } from '@src/modules/users-system/infrastucture/auth.repository';
import { UserRepository } from '../infrastucture/user.repository';
import { User } from '@src/modules/users-system/domain/user.entity';
import { NewPassword } from '@src/modules/users-system/domain/new.password';

// ⚠️ Моки для моделей
const mockModel = {
    // Можно добавить нужные методы: find, save и т.д.
};

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                { provide: 'INJECT_TOKEN.ACCESS_TOKEN', useClass: JwtService },
                { provide: 'INJECT_TOKEN.REFRESH_TOKEN', useClass: JwtService },
                { provide: AuthRepository, useValue: {} },
                { provide: UserRepository, useValue: {} },
                { provide: PasswordHashService, useValue: {} },
                { provide: EmailService, useValue: {} },
                { provide: UserConfig, useValue: { /* подставь нужные значения */ } },

                // Модели mongoose
                { provide: getModelToken(User.name), useValue: mockModel },
                { provide: getModelToken(NewPassword.name), useValue: mockModel },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    // Добавляй свои тесты тут
});
