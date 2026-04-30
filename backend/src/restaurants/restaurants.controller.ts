import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Post()
  @Roles(RoleName.SUPER_ADMIN)
  create(@Body() createDto: CreateRestaurantDto, @Request() req) {  
    return this.restaurantsService.create(createDto, req.user.role);
  }

  @Get()
  findAll(@Request() req) {
    return this.restaurantsService.findAll(req.user.role, req.user.restaurantId);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() req) {
    return this.restaurantsService.findOne(id, req.user.role, req.user.restaurantId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDto: any, @Request() req) {
    return this.restaurantsService.update(id, updateDto, req.user.role, req.user.restaurantId);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN)
  remove(@Param('id') id: number, @Request() req) {
    return this.restaurantsService.delete(id, req.user.role);
  }
}