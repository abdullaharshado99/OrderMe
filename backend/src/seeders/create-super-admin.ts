import { AppModule } from '../app.module';
import { NestFactory } from '@nestjs/core';
import { UsersService } from '../users/users.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    const email = 'superadmin@orderme.com';
    const existing = await usersService.findByEmail(email);

    if (!existing) {
        await usersService.createSuperAdmin({
            email,
            password: 'YourStrongPassword123!',
            name: 'Super Admin',
        });
    } else {
        console.warn('⚠️ Super Admin already exists');
    }

    await app.close();
}

bootstrap();