import { Controller, Delete, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { URL_PATH } from '../../core/url.path.setting';

@Controller()
export class TestingController {
    constructor(
        @InjectConnection() private readonly databaseConnection: Connection,
    ) {}

    @Delete(URL_PATH.testing)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAll() {
        const collections = await this.databaseConnection.listCollections();

        const promises = collections.map((collection) =>
            this.databaseConnection.collection(collection.name).deleteMany({}),
        );
        await Promise.all(promises);
    }
    @Get('json/version')
    getVersion() {
        return { browser: 'FakeBrowser/1.0', protocolVersion: '1.3' };
    }

    @Get('json/list')
    getList() {
        return [];
    }
}