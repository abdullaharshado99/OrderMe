import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { MenuItem } from '../menus/entities/menu-item.entity';
import { RoleName } from '../roles/entities/role.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(MenuItem)
        private menuRepository: Repository<MenuItem>,
    ) { }

    async createOrder(restaurantId: number, dto: CreateOrderDto) {
        const menuItemIds = dto.items?.map(i => i.menuItemId) ?? [];
        const menuItems = await this.menuRepository.findByIds(menuItemIds);
        const itemsWithDetails = dto.items?.map(item => {
            const menu = menuItems.find(m => m.id === item.menuItemId);
            if (!menu) throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
            return {
                menuItemId: item.menuItemId,
                name: menu.name,
                quantity: item.quantity,
                price: menu.price,
            };
        });
        const totalAmount = itemsWithDetails?.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 0), 0) ?? 0;
        const order = this.orderRepository.create({
            restaurantId,
            tableId: dto.tableId,
            customerName: dto.customerName,
            customerPhone: dto.customerPhone,
            items: itemsWithDetails,
            totalAmount,
            status: 'pending',
        });
        return this.orderRepository.save(order);
    }

    async getOrdersForRestaurant(restaurantId: number, currentUserRole: string, currentUserRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, currentUserRestaurantId);
        return this.orderRepository.find({ where: { restaurantId }, order: { createdAt: 'DESC' } });
    }

    async getOrderById(orderId: number, currentUserRole: string, currentUserRestaurantId?: number) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Order not found');
        if (currentUserRole === RoleName.SUPER_ADMIN) return order;
        if (currentUserRole === RoleName.CUSTOMER) return order; // customer can track
        if (currentUserRestaurantId === order.restaurantId) return order;
        throw new ForbiddenException('Access denied');
    }

    async updateOrderStatus(orderId: number, status: OrderStatus, currentUserRole: string, currentUserRestaurantId?: number) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Order not found');
        this.checkAccess(order.restaurantId ?? 0, currentUserRole, currentUserRestaurantId);
        order.status = status;
        return this.orderRepository.save(order);
    }

    async assignChef(orderId: number, chefId: number, currentUserRole: string, currentUserRestaurantId?: number) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Order not found');
        this.checkAccess(order.restaurantId ?? 0, currentUserRole, currentUserRestaurantId);
        order.assignedChefId = chefId;
        return this.orderRepository.save(order);
    }

    async updateOrderStation(orderId: number, station: string) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException();
        order.station = station;
        order.routingTime = new Date();
        return this.orderRepository.save(order);
    }

    async getKitchenQueue(restaurantId: number, station?: string) {
        const where: any = { restaurantId, status: 'cooking' };
        if (station && station !== 'all') where.station = station;
        return this.orderRepository.find({
            where,
            order: { createdAt: 'ASC' },
        });
    }

    async bumpOrder(orderId: number, userId: number) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException();
        order.status = 'ready';
        order.bumpedAt = new Date();
        order.bumpedBy = userId.toString();
        return this.orderRepository.save(order);
    }

    async getKdsStats(restaurantId: number) {
        const totalCooking = await this.orderRepository.count({ where: { restaurantId, status: 'cooking' } });
        const avgTime = await this.orderRepository
            .createQueryBuilder('order')
            .select('AVG(EXTRACT(epoch FROM (order.bumpedAt - order.createdAt)))', 'avg')
            .where('order.restaurantId = :id', { id: restaurantId })
            .andWhere('order.bumpedAt IS NOT NULL')
            .getRawOne();
        return { activeOrders: totalCooking, averageTicketTimeSeconds: Math.floor(avgTime?.avg || 0) };
    }

    private checkAccess(restaurantId: number, role: string, userRestaurantId?: number) {
        if (role === RoleName.SUPER_ADMIN) return;
        if (role === RoleName.RESTAURANT_OWNER && userRestaurantId === restaurantId) return;
        if (role === RoleName.CHEF && userRestaurantId === restaurantId) return;
        throw new ForbiddenException('Access denied');
    }
}