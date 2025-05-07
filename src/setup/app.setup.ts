import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from '@src/setup/swagger.setup';
import { HttpExceptionFilter } from '@core/exceptions/filters/http.exception.filter';
import { DomainExceptionFilter } from '@core/exceptions/filters/domain.exception.filter';
import passport from 'passport';

export function appSetup(app: INestApplication, isSwaggerEnable: boolean, globalPrefix: string) {
    pipesSetup(app);
    app.setGlobalPrefix(globalPrefix);
    swaggerSetup(app, isSwaggerEnable, globalPrefix);
    app.enableCors();
    app.use(passport.initialize());
    app.useGlobalFilters(new DomainExceptionFilter(), new HttpExceptionFilter());
}