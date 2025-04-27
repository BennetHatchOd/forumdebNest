import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/core.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const coreConfig = app.get<CoreConfig>(CoreConfig);
    appSetup(app, coreConfig.isSwaggerEnabled, coreConfig.globalPrefix);
    app.enableCors();
    const port = coreConfig.port;
    await app.listen(port);
    console.log(`Server running on port: ${port}, on the dataBase: ${coreConfig.mongoURI}`);
}
bootstrap();
