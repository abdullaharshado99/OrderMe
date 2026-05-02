import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, Header } from '@nestjs/common';
import { MenusService } from './menu.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';

@Controller('menus')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MenusController {
  constructor(private menusService: MenusService) { }

  @Post('restaurant/:restaurantId')
  @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
  create(@Param('restaurantId') restaurantId: number, @Body() dto: any, @Request() req) {
    return this.menusService.create(restaurantId, dto, req.user.role, req.user.restaurantId);
  }

  @Get('restaurant/:restaurantId')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  findAll(@Param('restaurantId') restaurantId: number, @Request() req) {
    return this.menusService.findAllByRestaurant(restaurantId, req.user.role, req.user.restaurantId);
  }

  @Patch(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
  update(@Param('id') id: number, @Body() dto: any, @Request() req) {
    return this.menusService.update(id, dto, req.user.role, req.user.restaurantId);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
  remove(@Param('id') id: number, @Request() req) {
    return this.menusService.delete(id, req.user.role, req.user.restaurantId);
  }
}