import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from '../setup/config.validation.utility';

export enum Environments {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
    TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
    // @IsNumber(
    //     {},
    //     {
    //         message: 'Set Env variable PORT, example: 3000',
    //     },
    // )
    // port: number = Number(this.configService.get('PORT'));
    //
    // @IsNotEmpty({
    //     message:
    //         'Set Env variable MONGO_URI, example: mongodb://localhost:27017/my-app-local-db',
    // })
    // mongoURI: string = this.configService.get('MONGO_URI');
    //
    // @IsEnum(Environments, {
    //     message:
    //         'Set correct NODE_ENV value'
    // })
    // env: string = this.configService.get('NODE_ENV');
    //
    // constructor(private configService: ConfigService<any, true>) {
    //     configValidationUtility.validateConfig(this);
    // }
}