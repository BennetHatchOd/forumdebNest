import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { HttpExceptionFilter } from '../core/exceptions/http.exception.filter';
import { pipesSetup } from './pipes.setup';

export function appSetup(app: INestApplication) {
    pipesSetup(app);
    globalPrefixSetup(app);
    swaggerSetup(app);

    app.useGlobalFilters(new HttpExceptionFilter());
}