import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { URL_PATH } from '../../core/url.path.setting';

@Controller(URL_PATH.testing)
export class TestingController {
    constructor(
        @InjectConnection() private readonly databaseConnection: Connection,
    ) {}

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAll() {
        const collections = await this.databaseConnection.listCollections();

        const promises = collections.map((collection) =>
            this.databaseConnection.collection(collection.name).deleteMany({}),
        );
        await Promise.all(promises);
    }
}