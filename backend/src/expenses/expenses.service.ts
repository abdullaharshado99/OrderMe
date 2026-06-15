import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBudgetDto } from './dto/budget.dto';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/expense.dto';
import { RoleName } from '../roles/entities/role.entity';
import { ExpenseBudget } from './entities/budget.entity';
import { CreateRecurringDto } from './dto/recurring.dto';
import { ExpenseApproval } from './entities/approval.entity';
import { RecurringExpense } from './entities/recurring-expense.entity';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectRepository(Expense)
        private expenseRepository: Repository<Expense>,
        @InjectRepository(ExpenseBudget)
        private budgetRepo: Repository<ExpenseBudget>,
        @InjectRepository(ExpenseApproval)
        private approvalRepo: Repository<ExpenseApproval>,
        @InjectRepository(RecurringExpense)
        private recurringRepo: Repository<RecurringExpense>,
    ) { }

    async create(restaurantId: number, dto: CreateExpenseDto, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        const expense = this.expenseRepository.create({ ...dto, restaurantId, date: dto.date || new Date() });
        return this.expenseRepository.save(expense);
    }

    async findAll(restaurantId: number, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        return this.expenseRepository.find({ where: { restaurantId }, order: { date: 'DESC' } });
    }

    async update(id: number, dto: Partial<CreateExpenseDto>, currentUserRole: string, userRestaurantId?: number) {
        const expense = await this.expenseRepository.findOne({ where: { id } });
        if (!expense) throw new NotFoundException('Expense not found');
        this.checkAccess(expense.restaurantId ?? 0, currentUserRole, userRestaurantId);
        Object.assign(expense, dto);
        return this.expenseRepository.save(expense);
    }

    async delete(id: number, currentUserRole: string, userRestaurantId?: number) {
        const expense = await this.expenseRepository.findOne({ where: { id } });
        if (!expense) throw new NotFoundException('Expense not found');
        this.checkAccess(expense.restaurantId ?? 0, currentUserRole, userRestaurantId);
        return this.expenseRepository.remove(expense);
    }

    async getSummary(restaurantId: number, year: number, month: number, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        const expenses = await this.expenseRepository.find({ where: { restaurantId, date: Between(start, end) } });
        const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const byCategory: Record<string, number> = {};
        expenses.forEach(e => {
            const category = e.category ?? 'uncategorized';
            byCategory[category] = (byCategory[category] || 0) + Number(e.amount);
        });
        return { total, byCategory, expenses };
    }

    private checkAccess(restaurantId: number, role: string, userRestaurantId?: number) {
        if (role === RoleName.SUPER_ADMIN) return;
        if (role === RoleName.RESTAURANT_OWNER && userRestaurantId === restaurantId) return;
        if (role === RoleName.CHEF && userRestaurantId === restaurantId) return;
        throw new ForbiddenException('Access denied');
    }

    async createBudget(restaurantId: number, dto: CreateBudgetDto, role: string) {
        if (role !== RoleName.RESTAURANT_OWNER && role !== RoleName.SUPER_ADMIN) throw new ForbiddenException();
        const budget = this.budgetRepo.create({ ...dto, restaurantId, month: new Date(dto.month!) });
        return this.budgetRepo.save(budget);
    }

    async getBudgets(restaurantId: number, role: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, role, userRestaurantId);
        return this.budgetRepo.find({ where: { restaurantId }, order: { month: 'DESC' } });
    }

    async getBudgetUtilization(restaurantId: number, role: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, role, userRestaurantId);
        const budgets = await this.budgetRepo.find({ where: { restaurantId } });
        const expenses = await this.expenseRepository.find({ where: { restaurantId } });
        const utilization = budgets.map((b: any) => {
            const spent = expenses.filter((e: any) => e.category === b.category && e.date && e.date >= b.month && e.date <= new Date(b.month.getFullYear(), b.month.getMonth() + 1, 0)).reduce((s, e) => s + Number(e.amount), 0);
            return { category: b.category, budget: Number(b.amount), spent, month: b.month };
        });
        return utilization;
    }

    async getPendingApprovals(restaurantId: number, role: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, role, userRestaurantId);
        return this.approvalRepo.find({ where: { status: 'pending' }, relations: ['expense'], order: { createdAt: 'ASC' } });
    }

    async approveExpense(approvalId: number, approverId: number, comment: string) {
        const approval = await this.approvalRepo.findOne({ where: { id: approvalId }, relations: ['expense'] });
        if (!approval) throw new NotFoundException();
        approval.status = 'approved';
        approval.approvedById = approverId;
        approval.comment = comment;
        await this.approvalRepo.save(approval);
        return approval;
    }

    async createRecurring(restaurantId: number, dto: CreateRecurringDto, role: string) {
        if (role !== RoleName.RESTAURANT_OWNER && role !== RoleName.SUPER_ADMIN) throw new ForbiddenException();
        const rec = this.recurringRepo.create({ ...dto, restaurantId, isActive: true });
        return this.recurringRepo.save(rec);
    }

    async getRecurring(restaurantId: number, role: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, role, userRestaurantId);
        return this.recurringRepo.find({ where: { restaurantId, isActive: true }, order: { category: 'ASC' } });
    }
}