import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { BloggingPlatformModule } from './modules/blogging.platform/blogging.platform.module';
import { DB_NAME, mongoURI } from './core/setting';
import { UserSystemModule } from './modules/users-system/user.system.module';
import { TestingModule } from './modules/testing/testing.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
    imports: [
        MongooseModule.forRoot(mongoURI, { dbName: DB_NAME }),
        BloggingPlatformModule,
        UserSystemModule,
        TestingModule,
        NotificationsModule,
    ],
    controllers: [AppController, ],
    providers: [AppService],
})
export class AppModule {}
