import { INestApplication, ValidationPipe } from '@nestjs/common';
import { URL_PATH } from '../core/setting';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { HttpExceptionFilter } from '../core/exceptions/http.exception.filter';

export function appSetup(app: INestApplication) {
    // pipesSetup(app);
    globalPrefixSetup(app);
    swaggerSetup(app);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
}