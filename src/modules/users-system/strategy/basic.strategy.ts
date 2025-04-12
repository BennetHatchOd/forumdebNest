
import { BasicStrategy} from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';

@Injectable()
export class myBasicStrategy extends PassportStrategy(BasicStrategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(login: string, password: string): Promise<boolean> {
        const isValideUser: boolean = await this.authService.validateUserForBasic(login, password);
        if (!isValideUser) {
            throw new UnauthorizedException();
        }
        return isValideUser;
    }
}
