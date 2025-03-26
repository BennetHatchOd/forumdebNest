import { Controller, Delete, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { URL_PATH } from './core/setting';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getStartPage(): string {
        return this.appService.getVersion();
    }


}
