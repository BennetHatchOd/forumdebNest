import { NestFactory } from '@nestjs/core';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/core.config';
import { initAppModule } from '@src/init.app.module';

async function bootstrap() {
    const DynamicAppModule = await initAppModule();
    const app = await NestFactory.create(DynamicAppModule);
    const coreConfig = app.get<CoreConfig>(CoreConfig);
    appSetup(app, coreConfig.isSwaggerEnabled, coreConfig.globalPrefix);

    const port = coreConfig.port;
    await app.listen(port);
    console.log(`Server running on port: ${port}, on the dataBase: ${coreConfig.mongoURI}`);
}
bootstrap();

