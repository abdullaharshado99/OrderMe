import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, Header } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CreateExpenseDto } from './dto/expense.dto';
import { CreateBudgetDto } from './dto/budget.dto';
import { ApproveExpenseDto } from './dto/approval.dto';
import { CreateRecurringDto } from './dto/recurring.dto';

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
    @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
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

    @Post('budgets')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    createBudget(@Body() dto: CreateBudgetDto, @Request() req) {
        return this.expensesService.createBudget(req.user.restaurantId, dto, req.user.role);
    }

    @Get('budgets')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    getBudgets(@Request() req) {
        return this.expensesService.getBudgets(req.user.restaurantId, req.user.role, req.user.restaurantId);
    }

    @Get('budgets/utilization')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    getBudgetUtilization(@Request() req) {
        return this.expensesService.getBudgetUtilization(req.user.restaurantId, req.user.role, req.user.restaurantId);
    }

    @Get('approvals/pending')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    getPendingApprovals(@Request() req) {
        return this.expensesService.getPendingApprovals(req.user.restaurantId, req.user.role, req.user.restaurantId);
    }

    @Post('approvals/:id/approve')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    approveExpense(@Param('id') id: number, @Body() body: ApproveExpenseDto, @Request() req) {
        return this.expensesService.approveExpense(id, req.user.userId, body.comment!);
    }

    @Post('recurring')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    createRecurring(@Body() dto: CreateRecurringDto, @Request() req) {
        return this.expensesService.createRecurring(req.user.restaurantId, dto, req.user.role);
    }

    @Get('recurring')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
    getRecurring(@Request() req) {
        return this.expensesService.getRecurring(req.user.restaurantId, req.user.role, req.user.restaurantId);
    }
}