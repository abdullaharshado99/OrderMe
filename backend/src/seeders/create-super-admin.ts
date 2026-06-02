import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { RoleName } from '../roles/entities/role.entity';

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
        console.log('✅ Super Admin created successfully');
    } else {
        console.log('⚠️ Super Admin already exists');
    }

    await app.close();
}

bootstrap();