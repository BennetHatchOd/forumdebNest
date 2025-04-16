import { configModule } from './setup/config.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { BloggingPlatformModule } from './modules/blogging.platform/blogging.platform.module';
import { UserSystemModule } from './modules/users-system/user.system.module';
import { TestingModule } from './modules/testing/testing.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CoreModule } from './core/core.module';
import { DB_NAME, mongoURI } from './core/setting';

@Module({
    imports: [
        configModule,
        MongooseModule.forRoot(mongoURI, { dbName: DB_NAME }),
        BloggingPlatformModule,
        UserSystemModule,
        TestingModule,
        CoreModule,
        NotificationsModule,
    ],
    controllers: [AppController, ],
    providers: [AppService],
})
export class AppModule {}
