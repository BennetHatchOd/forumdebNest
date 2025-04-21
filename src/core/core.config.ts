import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { configValidationUtility } from '../setup/config.validation.utility';

export enum Environments {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
    TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
    @IsNotEmpty()
    @IsNumber({},{
        message: 'Set Env variable PORT, example: 3000',
    })
    port: number;

    @IsNotEmpty()
    @IsString({
        message: 'Set Env variable DB_NAME, must be a string, example: appDB',
    })
    dbName: string;

    @IsNotEmpty({
        message: 'Set Env variable MONGO_URI, example: mongodb://localhost:27017/my-app-local-db',
    })
    mongoURI: string;

    @IsEnum(Environments, {
        message: 'Set correct NODE_ENV value'
    })
    env: string;

    @IsNotEmpty()
    @IsString({
        message: 'Set Env variable ADMIN_NAME_BASIC_AUTH'
    })
    adminNameBasicAuth: string;

    @IsNotEmpty()
    @IsString({
        message: 'Set Env variable ADMIN_PASSWORD_BASIC_AUTH'
    })
    adminPasswordBasicAuth: string;

    versionApp: string;

    constructor(private configService: ConfigService<any, true>) {
        this.port = Number(this.configService.get('PORT'));
        this.mongoURI = this.configService.get('MONGO_URI');
        this.env = this.configService.get('NODE_ENV');
        this.dbName = this.configService.get('DB_NAME');
        this.adminNameBasicAuth = this.configService.get('ADMIN_NAME_BASIC_AUTH');
        this.adminPasswordBasicAuth = this.configService.get('ADMIN_PASSWORD_BASIC_AUTH');
        this.versionApp = this.configService.get('VERSION_APP');

        configValidationUtility.validateConfig(this);
    }
}