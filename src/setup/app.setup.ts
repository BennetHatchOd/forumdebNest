import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { HttpExceptionFilter } from '@core/exceptions/filters/http.exception.filter';
import { pipesSetup } from './pipes.setup';

export function appSetup(app: INestApplication, isSwaggerEnable: boolean) {
    pipesSetup(app);
    globalPrefixSetup(app);
    swaggerSetup(app, isSwaggerEnable);

    //app.useGlobalFilters(new HttpExceptionFilter());
}