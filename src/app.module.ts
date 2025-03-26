import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { BloggingPlatformModule } from './modules/blogging.platform/blogging.platform.module';
import { DB_NAME, mongoURI } from './core/setting';

@Module({
    imports: [
        MongooseModule.forRoot(mongoURI, { dbName: DB_NAME }),
        BloggingPlatformModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
