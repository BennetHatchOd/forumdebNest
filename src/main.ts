import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './core/setting';
import { appSetup } from './core/setup/app.setup';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    appSetup(app);
    app.enableCors();
    await app.listen(PORT ?? 3014);
}
bootstrap();
