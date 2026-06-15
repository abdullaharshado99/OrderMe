import { AuthGuard } from '@nestjs/passport';
import { ShortsService } from './shorts.service';
import { RoleName } from '../roles/entities/role.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateShortDto, UpdateShortDto } from './dto/short.dto';
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';

@Controller('shorts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ShortsController {
    constructor(private shortsService: ShortsService) { }

    @Post()
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    create(@Body() dto: CreateShortDto, @Request() req) {
        return this.shortsService.create(req.user.restaurantId, dto, req.user.role);
    }

    @Get('restaurant/:restaurantId')
    findAll(@Param('restaurantId') id: number) {
        return this.shortsService.findAllByRestaurant(id);
    }

    @Patch(':id')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    update(@Param('id') id: number, @Body() dto: UpdateShortDto, @Request() req) {
        return this.shortsService.update(id, dto, req.user.role, req.user.restaurantId);
    }

    @Delete(':id')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    remove(@Param('id') id: number, @Request() req) {
        return this.shortsService.delete(id, req.user.role, req.user.restaurantId);
    }
}