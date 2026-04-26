import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/expense.dto';
import { RoleName } from '../roles/entities/role.entity';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectRepository(Expense)
        private expenseRepository: Repository<Expense>,
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
        const expenses = await this.expenseRepository.find({
            where: { restaurantId, date: Between(start, end) },
        });
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
}