import { INestApplication } from '@nestjs/common';
import { GLOBAL_PREFIX } from '../core/url.path.setting';

export function globalPrefixSetup(app: INestApplication) {
    //специальный метод, который добавляет ко всем маршрутам /GLOBAL_PREFIX
    app.setGlobalPrefix(GLOBAL_PREFIX);
}