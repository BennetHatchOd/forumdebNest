import { INestApplication, ValidationPipe } from '@nestjs/common';
import { URL_PATH } from '../setting';

export function appSetup(app: INestApplication) {
    // pipesSetup(app);
    // globalPrefixSetup(URL_PATH.base);
    // swaggerSetup(app);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
}