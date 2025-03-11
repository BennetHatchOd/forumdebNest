import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './core/setting';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(PORT ?? 3014);
}
bootstrap();
