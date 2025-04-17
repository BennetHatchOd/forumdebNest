import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: "loginOrEmail" });
    }

    async validate(loginOrEmail: string, password: string): Promise<string> {
        const userId: string | null = await this.authService.validateUserForLocalAuth(loginOrEmail, password);
        if (!userId) {
            throw new UnauthorizedException();
        }
        return userId;
    }
}
