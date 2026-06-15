import { AuthGuard } from '@nestjs/passport';
import { DealsService } from './deals.service';
import { RoleName } from '../roles/entities/role.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateDealDto, UpdateDealDto } from './dto/deal.dto';
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';

@Controller('deals')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DealsController {
    constructor(private dealsService: DealsService) { }

    @Post()
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    create(@Body() dto: CreateDealDto, @Request() req) {
        return this.dealsService.create(req.user.restaurantId, dto, req.user.role);
    }

    @Get('restaurant/:restaurantId')
    async findAll(@Param('restaurantId') id: number, @Query('cuisine') cuisine?: string) {
        return this.dealsService.findAllByRestaurant(id, cuisine);
    }

    @Patch(':id')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    update(@Param('id') id: number, @Body() dto: UpdateDealDto, @Request() req) {
        return this.dealsService.update(id, dto, req.user.role, req.user.restaurantId);
    }

    @Delete(':id')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    remove(@Param('id') id: number, @Request() req) {
        return this.dealsService.delete(id, req.user.role, req.user.restaurantId);
    }
}