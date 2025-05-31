import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { AUTH_PATH, URL_PATH } from '@core/url.path.setting';
import { initSettings } from '../helper/init.settings';
import { TestDataBuilderByDb } from '../helper/test.data.builder.by.db';
import { join } from 'path';
import { deleteAllData } from '../helper/delete.all.data';
import { INJECT_TOKEN } from '@core/constans/jwt.tokens';
import { UserConfig } from '@modules/users-system/config/user.config';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('UserAppController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let testData: TestDataBuilderByDb;
    let globalPrefix;

    beforeAll(async () => {
        const result
            = await initSettings((moduleBuilder) =>
                moduleBuilder
                    .overrideProvider(ThrottlerGuard)
                    .useValue({
                        canActivate: () => true,
                    }),
            // .compile();
        );
        app = result.app;
        connection = result.databaseConnection;
        testData = result.testData;
        globalPrefix = result.globalPrefix;
    //});
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Testing api/users with mistakes.', () => {
        beforeAll(async () => {
            testData.clearData();
            testData.numberUsers = 2;
            await testData.createManyUsers();
        })

        afterAll(async () => {
            await deleteAllData(app, globalPrefix);
        })
        it("should return 400 and an array of mistakes by attempt to create new " +
            "user with validation error", async () => {

            const response = await request(app.getHttpServer())
                .get(join(URL_PATH.users,'test'))
                .set("Authorization", testData.authLoginPassword)


        });


    })
});

