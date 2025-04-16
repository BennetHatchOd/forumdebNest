import { TrimLength } from '../../decorators/trim.string.length';
import { UserFieldRestrict } from '../../../modules/users-system/field.restrictions';
import { IsUUID } from 'class-validator';

export class NewPasswordInputDto{
    @TrimLength(UserFieldRestrict.passwordMin, UserFieldRestrict.passwordMax)
    newPassword: string;

    @IsUUID(4)
    recoveryCode: string;
}