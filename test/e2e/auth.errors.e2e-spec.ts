import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { AUTH_PATH, URL_PATH } from '@core/url.path.setting';
import { initSettings } from '../helper/init.settings';
import { TestDataBuilderByDb } from '../helper/test.data.builder.by.db';
import * as console from 'node:console';
import { join } from 'path';
import { deleteAllData } from '../helper/delete.all.data';
import { INJECT_TOKEN } from '@core/constans/jwt.tokens';
import { UserConfig } from '@src/modules/users-system/config/user.config';
import { JwtService } from '@nestjs/jwt';
import { EmailServiceMock } from '../mock/email.service.mock';
import { EmailService } from '@src/modules/notifications/application/email.service';

describe('AuthAppController with Errors (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let testData: TestDataBuilderByDb;
    let globalPrefix;
    let emailServiceMock: EmailServiceMock;

    beforeAll(async () => {
        const result
            = await initSettings((moduleBuilder) =>
            moduleBuilder
                .overrideProvider(INJECT_TOKEN.ACCESS_TOKEN)
                .useFactory({
                    factory: (userConfig: UserConfig) => {
                        return new JwtService({
                            secret: userConfig.accessTokenSecret,
                            signOptions: { expiresIn: '2s' },
                        });
                    },
                    inject: [UserConfig],
                }),
        );
        app = result.app;
        connection = result.databaseConnection;
        testData = result.testData;
        globalPrefix = result.globalPrefix;
        emailServiceMock = result.emailServiceMock;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Testing login user', () => {
        beforeAll(async () => {
            testData.clearData();
            testData.numberUsers = 2;
            await testData.createManyUsers();
        })

        afterAll(async () => {
            await deleteAllData(app, globalPrefix);
        })

        it('should return 401 with a wrong field name', async () => {
            const response = await request(app.getHttpServer())
                .post(join(URL_PATH.auth, AUTH_PATH.login))
                .send({
                    login: testData.users[0].login,
                    password: testData.usersPassword[0]
                })
                .expect(HttpStatus.UNAUTHORIZED)
        });

        it('should return 401 by wrong login, email, password', async () => {
            await request(app.getHttpServer())
                .post(join(URL_PATH.auth, AUTH_PATH.login))
                .send({
                    loginOrEmail: testData.users[0].login + 'h',
                    password: testData.usersPassword[0]
                })
                .expect(HttpStatus.UNAUTHORIZED)
            await request(app.getHttpServer())
                .post(join(URL_PATH.auth, AUTH_PATH.login))
                .send({
                    loginOrEmail: testData.users[0].email + 'h',
                    password: testData.usersPassword[0]
                })
                .expect(HttpStatus.UNAUTHORIZED)
            await request(app.getHttpServer())
                .post(join(URL_PATH.auth, AUTH_PATH.login))
                .send({
                    loginOrEmail: testData.users[0].login,
                    password: testData.usersPassword[0] + ' '
                })
                .expect(HttpStatus.UNAUTHORIZED)
        });
    });

    describe('Resenting email and confirmation with errors', () => {
            let code: string;
            const user = {
                login: "gytd",
                email: "gytd@gmail.com",
                password: "fvbnbnbnghG8"};

            beforeAll(async () => {
                testData.clearData();
                // testData.numberUsers = 1;
                // await testData.createManyUsers();
                jest.clearAllMocks();
            })
            afterAll(async () => {
                await deleteAllData(app, globalPrefix);
            })

            it('should return 400 if email not exist', async () => {
                const response = await request(app.getHttpServer())
                    .post(join(URL_PATH.auth, AUTH_PATH.resentEmail))
                    .send({
                        "email": "fakeEmail@example.com"
                    })
                    .expect(HttpStatus.BAD_REQUEST)
                expect(response.body).toEqual({"errorsMessages": [{
                            message: expect.any(String),
                            field: "email"},
                                            ]
                })
            });

            it('should return 400 if code for email is already confirmed', async () => {

                await request(app.getHttpServer())
                    .post(join(URL_PATH.auth, AUTH_PATH.registration))
                    .send(user)
                    .expect(HttpStatus.NO_CONTENT)
                code = emailServiceMock.createConfirmEmail.mock.calls[0][1];

                await request(app.getHttpServer())
                    .post(join(URL_PATH.auth, AUTH_PATH.confirmation))
                    .send({
                        code: code
                    })
                    .expect(HttpStatus.NO_CONTENT)

                const response = await request(app.getHttpServer())
                        .post(join(URL_PATH.auth, AUTH_PATH.confirmation))
                        .send({
                            code: code
                        })
                        .expect(HttpStatus.BAD_REQUEST)

                expect(response.body).toEqual({"errorsMessages": [{
                    message: expect.any(String),
                    field: "code"},
                ]})
            });

        it('should return 400 if email is already confirmed', async () => {

            const response = await request(app.getHttpServer())
                .post(join(URL_PATH.auth, AUTH_PATH.resentEmail))
                .send({
                    email: user.email,
                })
                .expect(HttpStatus.BAD_REQUEST)

            expect(response.body).toEqual({"errorsMessages": [{
                    message: expect.any(String),
                    field: "email"},
                ]})
        });

    });
});
            //     response = await request(app.getHttpServer())
            //         .post(join(URL_PATH.auth, AUTH_PATH.registration))
            //         .send({
            //             "login": "HEk:ghjgh",
            //             "password": "st",
            //             "email": "example@example.com"
            //         })
            //         .expect(HttpStatus.BAD_REQUEST)
            //     expect(response.body).toEqual({"errorsMessages": [{
            //             message: expect.any(String),
            //             field: "login"},
            //             {
            //                 message: expect.any(String),
            //                 field: "password",},
            //         ]
            //     })
            // });
            //
            // it('should return 400 after registration, if login or email exist', async () => {
            //     await request(app.getHttpServer())
            //         .post(join(URL_PATH.auth, AUTH_PATH.confirmation))
            //         .send({
            //             code: code
            //         })
            //         .expect(HttpStatus.NO_CONTENT)
            //
            //     await request(app.getHttpServer())
            //         .post(join(URL_PATH.auth, AUTH_PATH.login))
            //         .send({
            //             loginOrEmail: user.login,
            //             password: user.password
            //         })
            //         .expect(HttpStatus.OK)
            // });

            // it('should return 400 after attempting to re-confirm', async () => {
            //
            //     await request(app.getHttpServer())
            //         .post(join(URL_PATH.auth, AUTH_PATH.confirmation))
            //         .send({
            //             code: code
            //         })
            //         .expect(HttpStatus.BAD_REQUEST)
            // });



    // describe('Testing resending email for confirmation', () => {
    //     const user = {
    //         "login": "H2Te_VSg",
    //         "password": "string2",
    //         "email": "example2@example.com"
    //     }
    //     beforeAll(async () => {
    //         jest.clearAllMocks();
    //     })
    //     afterAll(async () => {
    //         await deleteAllData(app, globalPrefix);
    //     })
    //
    //     it('should return 204 after resending email. Registration, confirmation and login are used', async () => {
    //         let code: string;
    //         await request(app.getHttpServer())
    //             .post(join(URL_PATH.auth, AUTH_PATH.registration))
    //             .send(user)
    //             .expect(HttpStatus.NO_CONTENT)
    //
    //         await request(app.getHttpServer())
    //             .post(join(URL_PATH.auth, AUTH_PATH.resentEmail))
    //             .send({
    //                 email: user.email
    //             })
    //             .expect(HttpStatus.NO_CONTENT)
    //
    //         expect(emailServiceMock.createConfirmEmail).toHaveBeenCalled();
    //         expect(emailServiceMock.createConfirmEmail.mock.calls.length).toBe(2);
    //         expect(emailServiceMock.createConfirmEmail.mock.calls[1][0]).toBe(user.email);
    //         code = emailServiceMock.createConfirmEmail.mock.calls[1][1];
    //
    //         await request(app.getHttpServer())
    //             .post(join(URL_PATH.auth, AUTH_PATH.confirmation))
    //             .send({
    //                 code: code
    //             })
    //             .expect(HttpStatus.NO_CONTENT)
    //
    //         await request(app.getHttpServer())
    //             .post(join(URL_PATH.auth, AUTH_PATH.login))
    //             .send({
    //                 loginOrEmail: user.login,
    //                 password: user.password
    //             })
    //             .expect(HttpStatus.OK)
    //     });
    // });
    //
    // describe('Testing recovering password', () => {
    //     let code: string;
    //     const newPassword = 'Gt_re434g-ge';
    //
    //     beforeAll(async () => {
    //         testData.clearData();
    //         testData.numberUsers = 1;
    //         await testData.createManyUsers();
    //         jest.clearAllMocks();
    //     })
    //
    //     afterAll(async () => {
    //         await deleteAllData(app, globalPrefix);
    //     })
    //
    //     it('should return 204 and a code by email for recovery password', async () => {
    //         const response = await request(app.getHttpServer())
    //             .post(join(URL_PATH.auth, AUTH_PATH.askNewPassword))
    //             .send({
    //                 email: testData.users[0].email,
    //             })
    //             .expect(HttpStatus.NO_CONTENT)
    //
    //         expect(emailServiceMock.createPasswordRecovery).toHaveBeenCalled();
    //         expect(emailServiceMock.createPasswordRecovery.mock.calls[0][0]).toBe(testData.users[0].email);
    //         code = emailServiceMock.createPasswordRecovery.mock.calls[0][1];
    //
    //     });
    //
    //     it('should return 204 after set new password', async () => {
    //             const response = await request(app.getHttpServer())
    //                 .post(join(URL_PATH.auth, AUTH_PATH.confirmNewPassword))
    //                 .send({
    //                     newPassword: newPassword,
    //                     recoveryCode: code
    //                 })
    //                 .expect(HttpStatus.NO_CONTENT)
    //         });
    //
    //     it('should return 200 after login with new password', async () => {
    //             const response = await request(app.getHttpServer())
    //                 .post(join(URL_PATH.auth, AUTH_PATH.login))
    //                 .send({
    //                     loginOrEmail: testData.users[0].login,
    //                     password: newPassword
    //                 })
    //                 .expect(HttpStatus.OK)
    //             expect(response.body).toHaveProperty('accessToken');
    //         });
    //
    //     it('should return 401 after login with old password', async () => {
    //         const response = await request(app.getHttpServer())
    //             .post(join(URL_PATH.auth, AUTH_PATH.login))
    //             .send({
    //                 loginOrEmail: testData.users[0].login,
    //                 password: testData.usersPassword[0]
    //             })
    //             .expect(HttpStatus.UNAUTHORIZED)
    //     });
    // });
    //
    // describe('Testing about Me', () => {
    //     beforeAll(async () => {
    //         testData.clearData();
    //         testData.numberUsers = 1;
    //         await testData.createManyUsers();
    //         jest.clearAllMocks();
    //     })
    //
    //     afterAll(async () => {
    //         await deleteAllData(app, globalPrefix);
    //     })
    //
    //     it('should return 200 and an object information about user', async () => {
    //         const response = await request(app.getHttpServer())
    //             .post(join(URL_PATH.auth, AUTH_PATH.login))
    //             .send({
    //                 loginOrEmail: testData.users[0].email,
    //                 password: testData.usersPassword[0]
    //             })
    //             .expect(HttpStatus.OK)
    //         expect(response.body).toHaveProperty('accessToken');
    //         const accessToken = response.body.accessToken;
    //
    //         const jwtService = app.get<JwtService>(INJECT_TOKEN.ACCESS_TOKEN);
    //         const payload = jwtService.verify(accessToken); // <— проверит подпись и вернёт payload
    //         console.log(payload);
    //
    //         const responseAbout = await request(app.getHttpServer())
    //             .get(join(URL_PATH.auth, AUTH_PATH.aboutMe))
    //             .set("Authorization", "Bearer " + accessToken)
    //             .expect(HttpStatus.OK)
    //
    //         expect(responseAbout.body).toEqual({
    //             email: testData.users[0].email,
    //             login: testData.users[0].login,
    //             userId: testData.users[0]._id.toString(),
    //         });
    //
    //     });
    // })
