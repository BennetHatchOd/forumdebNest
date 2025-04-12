import { IsEmail, IsString, Length } from 'class-validator';
import { UserFieldRestrict } from '../../field.restrictions';

export class UserInputDto {
    @IsString()
    @Length(UserFieldRestrict.loginMin, UserFieldRestrict.loginMax)
    login: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @Length(UserFieldRestrict.passwordMax, UserFieldRestrict.passwordMax)
    password:  string;
}
