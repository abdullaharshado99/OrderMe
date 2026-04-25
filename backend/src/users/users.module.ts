import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
