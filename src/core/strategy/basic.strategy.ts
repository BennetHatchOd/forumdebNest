
import { BasicStrategy} from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../modules/users-system/application/auth.service';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

@Injectable()
export class myBasicStrategy extends PassportStrategy(BasicStrategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(login: string, password: string): Promise<boolean> {
        const isValideUser: boolean = await this.authService.validateUserForBasicAuth(login, password);
        if (!isValideUser) {
            throw new DomainException({
                message: '',
                code: DomainExceptionCode.Unauthorized});
        }
        return isValideUser;
    }
}
