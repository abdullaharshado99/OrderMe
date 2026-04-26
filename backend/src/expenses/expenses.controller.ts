import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CreateExpenseDto } from './dto/expense.dto';

@Controller('expenses')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ExpensesController {
    constructor(private expensesService: ExpensesService) { }

    @Post('restaurant/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    create(@Param('restaurantId') restaurantId: number, @Body() dto: CreateExpenseDto, @Request() req) {
        return this.expensesService.create(restaurantId, dto, req.user.role, req.user.restaurantId);
    }

    @Get('restaurant/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    findAll(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.expensesService.findAll(restaurantId, req.user.role, req.user.restaurantId);
    }

    @Patch(':id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    update(@Param('id') id: number, @Body() dto: Partial<CreateExpenseDto>, @Request() req) {
        return this.expensesService.update(id, dto, req.user.role, req.user.restaurantId);
    }

    @Delete(':id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    remove(@Param('id') id: number, @Request() req) {
        return this.expensesService.delete(id, req.user.role, req.user.restaurantId);
    }

    @Get('summary/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    getSummary(
        @Param('restaurantId') restaurantId: number,
        @Query('year') year: number,
        @Query('month') month: number,
        @Request() req,
    ) {
        return this.expensesService.getSummary(restaurantId, year, month, req.user.role, req.user.restaurantId);
    }
}