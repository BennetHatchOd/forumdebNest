import { NestExpressApplication } from '@nestjs/platform-express';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from '@src/setup/swagger.setup';
import { HttpExceptionFilter } from '@core/exceptions/filters/http.exception.filter';
import { DomainExceptionFilter } from '@core/exceptions/filters/domain.exception.filter';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { AppModule } from '@src/app.module';
import { Type } from '@nestjs/common';

export function appSetup(
    app: NestExpressApplication,
    isSwaggerEnable: boolean,
    globalPrefix: string,
    rootModule?: Type<any>
) {
    pipesSetup(app);
    app.setGlobalPrefix(globalPrefix);
    swaggerSetup(app, isSwaggerEnable, globalPrefix);
    app.enableCors();
    app.use(passport.initialize());
    app.set('trust proxy', 1);
    app.use(cookieParser());

    if (rootModule) {
        useContainer(app, { fallbackOnErrors: true });
    }
    app.useGlobalFilters(new DomainExceptionFilter(), new HttpExceptionFilter());
}
