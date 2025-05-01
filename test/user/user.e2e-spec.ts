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

    describe('Testing api/users GET', () => {
        it('/(GET) Get all users. Should return 200 status and paginator', async () => {

            const response = await request(app.getHttpServer())
                .get(URL_PATH.users)
                .set("Authorization", testData.authLoginPassword)
                .expect(HttpStatus.OK)

            expect(response.body).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: testData.numberUsers,
                items: expect.any(Array)
            });
        });

        it("/(GET) Get users by search string. Should return 200 status and paginator", async () => {

            const response = await request(app.getHttpServer())
                .get(URL_PATH.users)
                .set("Authorization", testData.authLoginPassword)
                .query({searchLoginTerm: '_1'})
                .expect(HttpStatus.OK)

            expect(response.body).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [{
                    login: 'lhfg_1',
                    email: 'gh2_1@test.com',
                    id:     expect.any(String),
                    createdAt: expect.any(String),
                }]
            });
        });

    })

    describe('Testing api/users POST', () => {
        it('/(POST) Create new user. Should return 201 status and created object', async () => {

            const response = await request(app.getHttpServer())
                .post(URL_PATH.users)
                .set("Authorization", testData.authLoginPassword)
                .send({ login: 'iouiu',
                        email: 'hjuh@hjuh.com',
                        password: 'gtghhTgg'})
                .expect(HttpStatus.CREATED)

            expect(response.body).toEqual({
                login: 'iouiu',
                email: 'hjuh@hjuh.com',
                id:     expect.any(String),
                createdAt: expect.any(String),
            });
        });

        it("/(POST) attempt to create new user with validation error.\n" +
            "\n Should return 400 status and array of mistakes", async () => {

            const response = await request(app.getHttpServer())
                .post(URL_PATH.users)
                .set("Authorization", testData.authLoginPassword)
                .send({ login: 'hj',
                    email: 'hjuh@hjuh.com',
                    password: 'gtghhTgg6ytghujikutghikkk'})
                .expect(HttpStatus.BAD_REQUEST)

            expect(response.body).toEqual({"errorsMessages": [
                    {message: expect.any(String),
                        field: "login"},
                    {message: expect.any(String),
                        field: "password"}
                ]
            });
        });

        it("/(POST) attempt to create new user with authorization error.\n" +
            "\n Should return 404 status", async () => {

            const response = await request(app.getHttpServer())
                .post(URL_PATH.users)
                .set("Authorization", "Bearer FGRFdfsfdf")
                .send({ login: 'hj',
                    email: 'hjuh@hjuh.com',
                    password: 'gtghhTgg6ytghujikutghikkk'})
                .expect(HttpStatus.UNAUTHORIZED)
        });

    })
});

