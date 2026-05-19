import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { Payment } from './entities/payment.entity';
import { OrdersService } from '../orders/orders.service';
import { AddItemDto, UpdateQuantityDto, ApplyDiscountDto, CheckoutDto } from './dto/pos.dto';
import { RoleName } from '../roles/entities/role.entity';

@Injectable()
export class PosService {
    constructor(
        @InjectRepository(Cart)
        private cartRepo: Repository<Cart>,
        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
        private ordersService: OrdersService,
    ) { }

    async createCart(
        restaurantId: number | null | undefined,
        userId: number | null | undefined,
        tableId?: number,
        terminalLabel?: string,
    ) {
        const cart = this.cartRepo.create({
            tableId: tableId ?? undefined,
            terminalLabel: terminalLabel ?? undefined,
            restaurantId: restaurantId ?? undefined,
        });
        return this.cartRepo.save(cart);
    }

    async getCart(id: number) {
        return this.cartRepo.findOne({ where: { id } });
    }

    async listActiveSessions(restaurantId: number | null | undefined, role: string) {
        if (
            (restaurantId == null || Number.isNaN(Number(restaurantId))) &&
            role !== RoleName.SUPER_ADMIN
        ) {
            throw new BadRequestException('Restaurant context is required');
        }
        const where =
            restaurantId != null && !Number.isNaN(Number(restaurantId))
                ? { restaurantId: Number(restaurantId) }
                : {};
        const carts = await this.cartRepo.find({
            where,
            order: { updatedAt: 'DESC' },
            take: 50,
        });
        return carts.filter((c) => (c.items?.length ?? 0) > 0);
    }

    async addItem(cartId: number, dto: AddItemDto) {
        const { menuItemId, name, quantity, price, modifiers } = dto;
        if (menuItemId == null || name == null || quantity == null || price == null) {
            throw new BadRequestException('menuItemId, name, quantity, and price are required');
        }
        const cart = await this.cartRepo.findOne({ where: { id: cartId } });
        if (!cart) throw new NotFoundException('Cart not found');
        const items = cart.items ?? [];
        const existing = items.find((i) => i.menuItemId === menuItemId);
        const line = { menuItemId, name, quantity, price, modifiers };
        if (existing) existing.quantity += quantity;
        else items.push(line);
        cart.items = items;
        return this.cartRepo.save(cart);
    }

    async updateQuantity(cartId: number, dto: UpdateQuantityDto) {
        if (dto.menuItemId == null || dto.quantity == null) {
            throw new BadRequestException('menuItemId and quantity are required');
        }
        const cart = await this.cartRepo.findOne({ where: { id: cartId } });
        if (!cart) throw new NotFoundException('Cart not found');
        const items = cart.items ?? [];
        const idx = items.findIndex((i) => i.menuItemId === dto.menuItemId);
        if (idx === -1) throw new NotFoundException('Item not in cart');
        if (dto.quantity <= 0) items.splice(idx, 1);
        else items[idx].quantity = dto.quantity;
        cart.items = items;
        return this.cartRepo.save(cart);
    }

    async applyDiscount(cartId: number, dto: ApplyDiscountDto) {
        if (dto.percent == null) throw new BadRequestException('percent is required');
        const cart = await this.cartRepo.findOne({ where: { id: cartId } });
        if (!cart) throw new NotFoundException('Cart not found');
        cart.discountPercent = dto.percent;
        return this.cartRepo.save(cart);
    }

    async checkout(cartId: number, dto: CheckoutDto, userId: number, restaurantId: number) {
        if (dto.paymentMethod == null) throw new BadRequestException('paymentMethod is required');
        const cart = await this.cartRepo.findOne({ where: { id: cartId } });
        if (!cart) throw new NotFoundException('Cart not found');
        const items = cart.items ?? [];
        const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const discount = (subtotal * (cart.discountPercent ?? 0)) / 100;
        const total = subtotal - discount + (cart.tax ?? 0) + (cart.serviceCharge ?? 0);
        const orderDto = {
            tableId: cart.tableId?.toString(),
            items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        };
        const order = await this.ordersService.createOrder(restaurantId, orderDto);
        await this.paymentRepo.save({
            orderId: order.id,
            method: dto.paymentMethod,
            amount: total,
        });
        await this.cartRepo.delete(cartId);
        return order;
    }
}