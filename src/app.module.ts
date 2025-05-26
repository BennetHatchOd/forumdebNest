import { configModule } from './setup/config.module';
import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { BloggingPlatformModule } from '@modules/blogging.platform/blogging.platform.module';
import { UserSystemModule } from '@modules/users-system/user.system.module';
import { TestingModule } from '@modules/testing/testing.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { CoreModule } from '@core/core.module';
import { CoreConfig } from '@core/core.config';
import { DatabaseModule } from '@core/database.module';

@Module({
    imports: [
        configModule,
        //DatabaseModule,
        MongooseModule.forRootAsync({
            useFactory: (coreConfig:CoreConfig) =>{
                const  url = new URL(coreConfig.mongoURI)
                url.pathname = '/' + coreConfig.dbName
                return { uri: url.toString()}
            },
            inject:[CoreConfig],
         }),
        BloggingPlatformModule,
        UserSystemModule,
        TestingModule,
        CoreModule,
        NotificationsModule,
    ],
    controllers: [AppController, ],
    providers: [AppService],
})

export class AppModule {
    static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {
        // такой мудрёный способ мы используем, чтобы добавить к основным модулям необязательный модуль.
        // чтобы не обращаться в декораторе к переменной окружения через process.env в декораторе, потому что
        // запуск декораторов происходит на этапе склейки всех модулей до старта жизненного цикла самого NestJS

        return {
            module: AppModule,
            imports: [...(coreConfig.includeTestingModule ? [TestingModule] : [])], // Add dynamic modules here
        };
    }
}
