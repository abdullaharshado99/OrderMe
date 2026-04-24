import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../../users/users.service';
import { RolesService } from '../../roles/roles.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';

class CreateAdminDto {
  email: string;
  name?: string;
}

@ApiTags('admin-managers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER-ADMIN')
@Controller('admin/managers')
export class AdminManagersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) { }

  @Get()
  async listAdmins() {
    const adminRole = await this.rolesService.findOne(2);
    return adminRole.users;
  }

  @Get('all-users')
  async listAllUsers() {
    return this.usersService.findAll();
  }

  @Post()
  async promoteByEmail(@Body('email') rawEmail: string) {
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User not found for email ${email}`);
    }

    const adminRole = await this.rolesService.findOne(2);
    user.role = adminRole;
    return this.usersService['usersRepository'].save(user);
  }

  @Delete(':id')
  async revoke(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id, ['role']);
    if (!user) {
      return { success: false };
    }
    const userRole = await this.rolesService.findOne(1);
    user.role = userRole;
    await this.usersService['usersRepository'].save(user);
    return { success: true };
  }
}