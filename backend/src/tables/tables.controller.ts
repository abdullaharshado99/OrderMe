import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TablesService } from './tables.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';

@Controller('tables')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TablesController {
    constructor(private tablesService: TablesService) { }

    @Post()
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    create(@Body() dto: CreateTableDto, @Request() req) {
        return this.tablesService.create(req.user.restaurantId, dto, req.user.role);
    }

    @Get('restaurant/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    findAll(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.tablesService.findAllByRestaurant(restaurantId, req.user.role, req.user.restaurantId);
    }

    @Patch(':id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    update(@Param('id') id: number, @Body() dto: UpdateTableDto, @Request() req) {
        return this.tablesService.update(id, dto, req.user.role, req.user.restaurantId);
    }

    @Delete(':id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    remove(@Param('id') id: number, @Request() req) {
        return this.tablesService.delete(id, req.user.role, req.user.restaurantId);
    }
}