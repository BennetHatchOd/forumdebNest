import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { initAppModule } from '@src/init.app.module';
import { appSetup } from '@src/setup/app.setup';
import { deleteAllData } from './delete.all.data';
import { CoreConfig } from '@core/core.config';
import { UserConfig } from '@src/modules/users-system/config/user.config';
import {
    Blog,
    BlogModelType,
} from '@src/modules/blogging.platform/domain/blog.entity';
import {
    Post,
    PostModelType,
} from '@src/modules/blogging.platform/domain/post.entity';
import { Comment, CommentModelType } from '@src/modules/blogging.platform/domain/comment.entity';
import {
    User,
    UserModelType,
} from '@src/modules/users-system/domain/user.entity';
import { TestDataBuilderByDb } from './test.data.builder.by.db';
import { EmailService } from '@src/modules/notifications/application/email.service';
import { EmailServiceMock } from '../mock/email.service.mock';
import { PasswordHashService } from '@src/modules/users-system/application/password.hash.service';

export const initSettings = async (
    //передаем callback, который получает ModuleBuilder, если хотим изменить настройку тестового модуля
    addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
    const DynamicAppModule = await initAppModule();
    const emailServiceMock = new EmailServiceMock();
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
        imports: [DynamicAppModule],
        })
        .overrideProvider(EmailService)
        .useValue(emailServiceMock);

    if (addSettingsToModuleBuilder) {
        addSettingsToModuleBuilder(testingModuleBuilder);
    }

    const testingAppModule = await testingModuleBuilder.compile();

    const app = testingAppModule.createNestApplication();
    const coreConfig = app.get<CoreConfig>(CoreConfig);
    const userConfig = app.get<UserConfig>(UserConfig);
    const globalPrefix = coreConfig.globalPrefix
    appSetup(app, coreConfig.isSwaggerEnabled, globalPrefix);

    await app.init();

    const databaseConnection = app.get<Connection>(getConnectionToken());
    const httpServer = app.getHttpServer();
    await deleteAllData(app, coreConfig.globalPrefix);

    const passwordHashService = app.get<PasswordHashService>(PasswordHashService);
    const blogModel = app.get<BlogModelType>(getModelToken(Blog.name));
    const postModel = app.get<PostModelType>(getModelToken(Post.name));
    const commentModel = app.get<CommentModelType>(getModelToken(Comment.name));
    const userModel = app.get<UserModelType>(getModelToken(User.name));
    const testData = await TestDataBuilderByDb.createTestData(app,
                                                                        userConfig,
                                                                        blogModel,
                                                                        postModel,
                                                                        commentModel,
                                                                        userModel,
                                                                        passwordHashService,
                                                                        );

    return {
        app,
        databaseConnection,
        httpServer,
        testData,
        globalPrefix,
        emailServiceMock,
    };
};