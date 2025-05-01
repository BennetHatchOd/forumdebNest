import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { TestDataBuilder } from '../helper/test.data.builder';
import { URL_PATH } from '@core/url.path.setting';
// @ts-ignore
import { initSettings } from '../helper/init.settings';
import { TestDataBuilderByDb } from '../helper/test.data.builder.by.db';

describe('UserAppController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let testData: TestDataBuilder;
    // let testData: TestDataBuilerByDb;

    beforeAll(async () => {
        const result = await initSettings()
        // (moduleBuilder) =>
        //     moduleBuilder
        //         .overrideProvider(UserConfig)
        //         .useFactory({
        //             factory: (userConfig: UserConfig) => {
        //                 return new JwtService({
        //                     secret: userConfig.accessTokenSecret,
        //                     signOptions: { expiresIn: '2s' },
        //                 });
        //             },
        //             inject: [UserConfig],
        //         }),
        // );
        app = result.app;
        connection = result.databaseConnection;
        testData = result.testData;
    //});
    });

    afterAll(async () => {
        await app.close();
    });

    it('/ (POST)', async () => {

        const response = await request(app.getHttpServer())
            .post(URL_PATH.users)
            .set("Authorization", testData.authLoginPassword)
            .send({ login: 'hjuh',
                    email: 'hjuh@hjuh.com',
                    password: 'gtghhTgg'})
            .expect(HttpStatus.CREATED)

        expect(response.body).toEqual({
                login: 'hjuh',
                email: 'hjuh@hjuh.com',
                id:     expect.any(String),
                createdAt: expect.any(String),
            });
    });
});

