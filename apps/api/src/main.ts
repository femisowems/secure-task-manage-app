import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`\n🚀 Application is running on: http://localhost:${port}/api`);
    console.log('\n🔑 TEST CREDENTIALS:');
    console.log('-----------------------------------');
    console.log('Admin (Owner): admin@test.com / password123');
    console.log('User (Viewer): user@test.com  / password123');
    console.log('-----------------------------------\n');
}
bootstrap();
