import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto, RenewSubscriptionDto } from './dto/subscription.dto';
import { RoleName } from '../roles/entities/role.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private subRepo: Repository<Subscription>,
        @InjectRepository(Restaurant)
        private restaurantRepo: Repository<Restaurant>,
    ) { }

    async create(dto: CreateSubscriptionDto, currentUserRole: string) {
        if (currentUserRole !== RoleName.SUPER_ADMIN) {
            throw new ForbiddenException('Only super admin can create subscriptions');
        }
        const sub = this.subRepo.create(dto);
        const saved = await this.subRepo.save(sub);
        // Update restaurant's subscription plan and expiry
        await this.restaurantRepo.update(dto.restaurantId!, {
            subscriptionPlan: dto.plan,
            subscriptionExpiry: new Date(dto.endDate!),
        });
        return saved;
    }

    async findByRestaurant(restaurantId: number, currentUserRole: string, userRestaurantId?: number) {
        if (currentUserRole !== RoleName.SUPER_ADMIN && userRestaurantId !== restaurantId) {
            throw new ForbiddenException('Access denied');
        }
        return this.subRepo.find({ where: { restaurantId }, order: { createdAt: 'DESC' } });
    }

    async getCurrentSubscription(restaurantId: number, currentUserRole: string, userRestaurantId?: number) {
        if (currentUserRole !== RoleName.SUPER_ADMIN && userRestaurantId !== restaurantId) {
            throw new ForbiddenException('Access denied');
        }
        return this.subRepo.findOne({
            where: { restaurantId, isActive: true },
            order: { endDate: 'DESC' },
        });
    }

    async renewSubscription(subscriptionId: number, dto: RenewSubscriptionDto, currentUserRole: string) {
        if (currentUserRole !== RoleName.SUPER_ADMIN) {
            throw new ForbiddenException('Only super admin can renew');
        }
        const sub = await this.subRepo.findOne({ where: { id: subscriptionId } });
        if (!sub) throw new NotFoundException('Subscription not found');
        // Mark old as inactive
        sub.isActive = false;
        await this.subRepo.save(sub);
        // Create new
        const newSub = this.subRepo.create({
            restaurantId: sub.restaurantId,
            plan: dto.plan,
            price: dto.price,
            startDate: new Date(dto.startDate!),
            endDate: new Date(dto.endDate!),
            isActive: true,
        });
        const saved = await this.subRepo.save(newSub);
        await this.restaurantRepo.update(sub.restaurantId!, {
            subscriptionPlan: dto.plan,
            subscriptionExpiry: new Date(dto.endDate!),
        });
        return saved;
    }

    // Cron job to deactivate expired subscriptions
    async deactivateExpiredSubscriptions() {
        const expired = await this.subRepo.find({
            where: { endDate: LessThan(new Date()), isActive: true },
        });
        for (const sub of expired) {
            sub.isActive = false;
            await this.subRepo.save(sub);
            await this.restaurantRepo.update(sub.restaurantId!, { isActive: false });
        }
        return { deactivated: expired.length };
    }
}