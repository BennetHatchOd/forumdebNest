import { Injectable } from '@nestjs/common';
import { VERSION_APP } from './core/setting';

@Injectable()
export class AppService {
    getVersion(): string {
        return VERSION_APP;
    }
}
