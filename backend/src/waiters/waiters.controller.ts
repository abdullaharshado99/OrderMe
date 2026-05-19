import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WaitersService } from './waiters.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CreateWaiterDto, UpdateWaiterDto } from './dto/waiter.dto';

@Controller('waiters')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class WaitersController {
    constructor(private waitersService: WaitersService) { }

    @Post()
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    create(@Body() dto: CreateWaiterDto, @Request() req) {
        return this.waitersService.create(req.user.restaurantId, dto, req.user.role);
    }

    @Get('restaurant/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    findAll(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.waitersService.findAllByRestaurant(restaurantId, req.user.role, req.user.restaurantId);
    }

    @Patch(':id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    update(@Param('id') id: number, @Body() dto: UpdateWaiterDto, @Request() req) {
        return this.waitersService.update(id, dto, req.user.role, req.user.restaurantId);
    }

    @Delete(':id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    remove(@Param('id') id: number, @Request() req) {
        return this.waitersService.delete(id, req.user.role, req.user.restaurantId);
    }
}