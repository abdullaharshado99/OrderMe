import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InventoryController {
    constructor(private inventoryService: InventoryService) { }

    @Post('restaurant/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    create(@Param('restaurantId') restaurantId: number, @Body() dto: any, @Request() req) {
        return this.inventoryService.create(restaurantId, dto, req.user.role, req.user.restaurantId);
    }

    @Get('restaurant/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    findAll(@Param('restaurantId') restaurantId: number, @Query('type') type: string, @Request() req) {
        return this.inventoryService.findAll(restaurantId, type, req.user.role, req.user.restaurantId);
    }

    @Patch(':id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    update(@Param('id') id: number, @Body() dto: any, @Request() req) {
        return this.inventoryService.update(id, dto, req.user.role, req.user.restaurantId);
    }

    @Delete(':id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    remove(@Param('id') id: number, @Request() req) {
        return this.inventoryService.delete(id, req.user.role, req.user.restaurantId);
    }
}