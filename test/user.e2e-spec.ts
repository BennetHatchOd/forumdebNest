import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { URL_PATH } from '../src/core/url.path.setting';

describe('UserAppController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;

    beforeEach(async () => {
        const testingModuleBuilder = Test.createTestingModule({
            imports: [AppModule],
        });
        const moduleFixture: TestingModule = await testingModuleBuilder.compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        connection = moduleFixture.get<Connection>(getConnectionToken());
    });

    afterAll(async () => {
        await app.close();
    });

    it('/ (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post(URL_PATH.users)
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

