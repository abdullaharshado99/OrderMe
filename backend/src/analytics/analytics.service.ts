import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { RoleName } from '../roles/entities/role.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        @InjectRepository(Expense)
        private expenseRepo: Repository<Expense>,
    ) { }

    async getSalesReport(restaurantId: number, period: 'daily' | 'weekly' | 'monthly', currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        const now = new Date();
        let startDate: Date;
        switch (period) {
            case 'daily':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'weekly':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'monthly':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
        }
        const orders = await this.orderRepo.find({
            where: { restaurantId, createdAt: Between(startDate, new Date()) },
        });
        const totalSales = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const orderCount = orders.length;
        const avgOrderValue = orderCount ? totalSales / orderCount : 0;
        return { totalSales, orderCount, avgOrderValue, period, orders };
    }

    async getPopularItems(restaurantId: number, limit: number = 5, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        const orders = await this.orderRepo.find({ where: { restaurantId } });
        const itemCount = new Map<number, { name: string; quantity: number }>();
        for (const order of orders) {
            for (const item of order.items!) {
                const existing = itemCount.get(item.menuItemId);
                if (existing) existing.quantity += item.quantity;
                else itemCount.set(item.menuItemId, { name: item.name, quantity: item.quantity });
            }
        }
        const sorted = Array.from(itemCount.entries())
            .map(([id, val]) => ({ id, ...val }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, limit);
        return sorted;
    }

    async getDashboard(restaurantId: number, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ordersToday = await this.orderRepo.count({ where: { restaurantId, createdAt: Between(today, new Date()) } });
        const pendingOrders = await this.orderRepo.count({ where: { restaurantId, status: 'pending' } });
        const totalRevenue = await this.orderRepo
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'sum')
            .where('order.restaurantId = :id', { id: restaurantId })
            .getRawOne();
        const lowStock = []; // you can add inventory check here
        return {
            ordersToday,
            pendingOrders,
            totalRevenue: totalRevenue.sum || 0,
            lowStock,
        };
    }

    private checkAccess(restaurantId: number, role: string, userRestaurantId?: number) {
        if (role === RoleName.SUPER_ADMIN) return;
        if (role === RoleName.RESTAURANT_OWNER && userRestaurantId === restaurantId) return;
        throw new ForbiddenException('Access denied');
    }
}