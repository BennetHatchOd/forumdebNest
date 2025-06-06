import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/users-system/application/user.service';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: UserService) {
        super({ usernameField: "loginOrEmail" });
    }

    async validate(loginOrEmail: string, password: string): Promise<string> {
        const userId: string | null = await this.authService.validateUserForLocalAuth(loginOrEmail, password);
        if (!userId) {
            throw new DomainException({
                message: '',
                code: DomainExceptionCode.Unauthorized});
        }
        return userId;
    }
}
