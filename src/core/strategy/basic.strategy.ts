
import { BasicStrategy} from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/users-system/application/user.service';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

@Injectable()
export class myBasicStrategy extends PassportStrategy(BasicStrategy, 'basic') {
    constructor(private authService: UserService) {
        super();
    }

    async validate(loginOrEmail: string, password: string): Promise<boolean> {
        const isValideUser: boolean = await this.authService.validateUserForBasicAuth(loginOrEmail, password);
        if (!isValideUser) {
            throw new DomainException({
                message: '',
                code: DomainExceptionCode.Unauthorized});
        }
        return isValideUser;
    }
}
