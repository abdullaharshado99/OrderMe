import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
  async findAll(@Request() req) {
    const { role, restaurantId } = req.user;
    return this.usersService.findAll(restaurantId, role, restaurantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req) {
    return this.usersService.findOne(id, req.user.role, req.user.restaurantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: any,
    @Request() req,
  ) {
    return this.usersService.updateProfile(
      id,
      updateData,
      req.user.userId,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
  async remove(@Param('id') id: number, @Request() req) {
    return this.usersService.deleteUser(
      id,
      req.user.role,
      req.user.restaurantId,
    );
  }

  @Post(':id/role')
  @Roles(RoleName.SUPER_ADMIN)
  async assignRole(
    @Param('id') id: number,
    @Body('roleName') roleName: RoleName,
    @Request() req,
  ) {
    return this.usersService.assignRole(id, roleName, req.user.role);
  }

  @Get('restaurant/:restaurantId')
  @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
  async getUsersByRestaurant(
    @Param('restaurantId') restaurantId: number,
    @Request() req,
    @Query('role') role?: RoleName,
  ) {
    return this.usersService.findByRestaurant(restaurantId, role, req.user.role, req.user.restaurantId);
  }
}