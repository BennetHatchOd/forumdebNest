import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

    @IsBoolean({
        message: 'Set Env variable INCLUDE_TESTING_MODULE, to enable the module the value must be {true, 1 or enabled}'
    })
    includeTestingModule: boolean;

    @IsBoolean({
        message: 'Set Env variable INCLUDE_TESTING_MODULE, to enable the module the value must be {true, 1 or enabled}'
    })
    isSwaggerEnabled: boolean;

    @IsEnum(Environments, {
        message: 'Set correct NODE_ENV value, available values are {DEVELOPMENT, STAGING, PRODUCTION or TESTING}'
    })
    env: string;

    @IsString({
        message: 'Env variable GLOBAL_PREFIX, must be a string, example: appDB',
    })
    globalPrefix: string;

    versionApp: string;

    constructor(private configService: ConfigService<any, true>) {
        this.port = Number(this.configService.get('PORT'));
        this.mongoURI = this.configService.get('MONGO_URI');
        this.env = this.configService.get('NODE_ENV');
        this.dbName = this.configService.get('DB_NAME');
        this.includeTestingModule = configValidationUtility.convertToBoolean(this.configService.get('INCLUDE_TESTING_MODULE')) as boolean;
        this.globalPrefix = this.configService.get('GLOBAL_PREFIX');
        this.versionApp = this.configService.get('VERSION_APP');
        this.isSwaggerEnabled = configValidationUtility.convertToBoolean(this.configService.get('IS_SWAGGER_ENABLE')) as boolean;


        configValidationUtility.validateConfig(this);
    }
}