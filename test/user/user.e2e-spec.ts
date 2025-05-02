import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { URL_PATH } from '@core/url.path.setting';
import { initSettings } from '../helper/init.settings';
import { TestDataBuilderByDb } from '../helper/test.data.builder.by.db';
import * as console from 'node:console';
import { join } from 'path';

describe('UserAppController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let testData: TestDataBuilderByDb;
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
        testData.numberUsers = 8;
        await testData.createManyUsers();
    //});
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Testing api/users GET, POST, DELETE', () => {
        const newUser = {
            login: 'iouiu',
            email: 'hjuhPTK@fhjuh.com',
            password: 'gtghhTgg'};
        const newUser2 = {
            login: 'tydjh',
            email: 'hjuhpPTK@hjuh.com',
            password: 'gtghhTgg'};
        let id1: string;
        let id2: string;

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

        it('/(POST) Create new users. Should return 201 status and created object', async () => {
            let response = await request(app.getHttpServer())
                .post(URL_PATH.users)
                .set("Authorization", testData.authLoginPassword)
                .send(newUser)
                .expect(HttpStatus.CREATED)

            expect(response.body).toEqual({
                login: newUser.login,
                email: newUser.email,
                id:     expect.any(String),
                createdAt: expect.any(String),
            });
            id1 = response.body.id;

            response = await request(app.getHttpServer())
                .post(URL_PATH.users)
                .set("Authorization", testData.authLoginPassword)
                .send(newUser2)
                .expect(HttpStatus.CREATED)
            id2 = response.body.id;
        });

        it("/(GET) Get created users by search string of login and Email. " +
            "Should return 200 status and paginator", async () => {
            let response = await request(app.getHttpServer())
                .get(URL_PATH.users)
                .set("Authorization", testData.authLoginPassword)
                .query({searchLoginTerm: 'io'})
                .expect(HttpStatus.OK)

            expect(response.body).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [{
                    login: newUser.login,
                    email: newUser.email,
                    id:     expect.any(String),
                    createdAt: expect.any(String),
                }]
            });

            response = await request(app.getHttpServer())
                .get(URL_PATH.users)
                .set("Authorization", testData.authLoginPassword)
                .query({searchEmailTerm: 'pTk', sortDirection: 'asc'})
                .expect(HttpStatus.OK)

            expect(response.body).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [{
                    login: newUser.login,
                    email: newUser.email,
                    id:     expect.any(String),
                    createdAt: expect.any(String)},
                    {login: newUser2.login,
                    email: newUser2.email,
                    id:     expect.any(String),
                    createdAt: expect.any(String)}
                ]
            });
        });

        it('/(DELETE) Delete new users. Should return 204 status', async () => {
            await request(app.getHttpServer())
                .delete(join(URL_PATH.users, id1))
                .set("Authorization", testData.authLoginPassword)
                .expect(HttpStatus.NO_CONTENT)

            await request(app.getHttpServer())
                .delete(join(URL_PATH.users, id2))
                .set("Authorization", testData.authLoginPassword)
                .expect(HttpStatus.NO_CONTENT)
        })

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
    })

    describe('Testing api/users GET, POST, DELETE with mistakes', () => {

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

        it("/(POST, GET, DELETE) attempt to access endpoint user with authorization error.\n" +
            "\n Should return 404 status", async () => {

            await request(app.getHttpServer())
                .post(URL_PATH.users)
                .set("Authorization", "Bearer FGRFdfsfdf")
                .send({ login: 'hj',
                    email: 'hjuh@hjuh.com',
                    password: 'gtghhTgg6ytghujikutghikkk'})
                .expect(HttpStatus.UNAUTHORIZED)
            await request(app.getHttpServer())
                .get(URL_PATH.users)
                .expect(HttpStatus.UNAUTHORIZED)
            await request(app.getHttpServer())
                .delete(join(URL_PATH.users, '6814e896da2168245826d049'))
                .set("Authorization", "Bearer FGRFdfsfdf")
                .expect(HttpStatus.UNAUTHORIZED)
        });
        it("/(DELETE) attempt to delete fake user.\n" +
            "\n Should return 404 status", async () => {

            await request(app.getHttpServer())
                .delete(join(URL_PATH.users, '6814e896da2168245826d049'))
                .set("Authorization", testData.authLoginPassword)
                .expect(HttpStatus.NOT_FOUND)
        });

        it("/(DELETE) attempt to delete user by fake, not valide id.\n" +
            "\n Should return 400 status", async () => {

            await request(app.getHttpServer())
                .delete(join(URL_PATH.users, '681896da2168245826d049'))
                .set("Authorization", testData.authLoginPassword)
                .expect(HttpStatus.BAD_REQUEST)
        });

    })
});

