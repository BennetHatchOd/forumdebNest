import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { configValidationUtility } from '../../../setup/config.validation.utility';


@Injectable()
export class UserConfig {

    @IsNotEmpty({
            message: 'Env variable ACCESS_TOKEN_SECRET_KEY must be a string',
    })
    accessTokenSecret: string;//= this.configService.get('ACCESS_TOKEN_SECRET');

    @IsNotEmpty({
            message: 'Env variable REFRESH_TOKEN_SECRET_KEY must be a string',
    })
    refreshTokenSecret: string; //= this.configService.get('REFRESH_TOKEN_SECRET');

    @IsNotEmpty()
    @IsNumber({},{
            message: 'Env variable TIME_LIFE_ACCESS_TOKEN must be a number',
    })
    timeLifeAccessToken: number; //= Number(this.configService.get('TIME_LIFE_ACCESS_TOKEN'));

    @IsNotEmpty()
    @IsNumber({},{
        message: 'Env variable TIME_LIFE_REFRESH_TOKEN must be a number',
    })
    timeLifeRefreshToken: number; //= Number(this.configService.get('TIME_LIFE_REFRESH_TOKEN'));

    @IsNotEmpty()
    @IsString({
        message: 'Set Env variable PASSWORD_MAIL',
    })
    passwordEmail: string;

    @IsNotEmpty()
    @IsNumber({},{
        message: 'Env variable TIME_LIFE_EMAIL_CODE must be a number',
    })
    timeLifeEmailCode: number;

    @IsNotEmpty()
    @IsNumber({},{
        message: 'Set Env variable TIME_LIFE_PASSWORD_CODE must be a number',
    })
    timeLifePasswordCode: number;

    @IsNotEmpty()
    @IsNumber({},{
        message: 'Env variable SALT_ROUND must be a number ',
    })
    saltRound: number;

    constructor(private configService: ConfigService<any, true>) {
        console.log('NODE_ENV =', process.env.NODE_ENV);
        console.log('ACCESS_TOKEN_SECRET_KEY:', this.configService.get('ACCESS_TOKEN_SECRET'));
        this.accessTokenSecret =this.configService.get('ACCESS_TOKEN_SECRET');
        this.refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET');
        this.timeLifeAccessToken = Number(this.configService.get('TIME_LIFE_ACCESS_TOKEN'));
        this.timeLifeRefreshToken = Number(this.configService.get('TIME_LIFE_REFRESH_TOKEN'));
        this.passwordEmail = this.configService.get('PASSWORD_MAIL');
        this.timeLifeEmailCode = Number(this.configService.get('TIME_LIFE_EMAIL_CODE'));
        this.timeLifePasswordCode = Number(this.configService.get('TIME_LIFE_PASSWORD_CODE'));
        this.saltRound = Number(this.configService.get('SALT_ROUND'));

        configValidationUtility.validateConfig(this);
    }
}