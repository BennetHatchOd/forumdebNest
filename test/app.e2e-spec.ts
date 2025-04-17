import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { VERSION_APP } from '../src/core/setting';

describe('AppController (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const testingModuleBuilder = Test.createTestingModule({
            imports: [AppModule],
        });
        const moduleFixture: TestingModule = await testingModuleBuilder.compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect(VERSION_APP);
    });
});

