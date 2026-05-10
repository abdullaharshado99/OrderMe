import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto, RenewSubscriptionDto } from './dto/subscription.dto';
import { RoleName } from '../roles/entities/role.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private subRepo: Repository<Subscription>,
        @InjectRepository(Restaurant)
        private restaurantRepo: Repository<Restaurant>,
        @InjectRepository(SubscriptionPlan)
        private planRepo: Repository<SubscriptionPlan>,
    ) { }

    async create(dto: CreateSubscriptionDto, currentUserRole: string) {
        if (currentUserRole !== RoleName.SUPER_ADMIN) {
            throw new ForbiddenException('Only super admin can create subscriptions');
        }
        const sub = this.subRepo.create(dto);
        const saved = await this.subRepo.save(sub);
        await this.restaurantRepo.update(dto.restaurantId!, {
            subscriptionPlan: dto.plan,
            subscriptionExpiry: new Date(dto.endDate!),
        });
        return saved;
    }

    async getAllWithRestaurants() {
        return this.subRepo.find({ relations: ['restaurant'], order: { createdAt: 'DESC' } });
    }

    async createSubscriptionFromPlan(restaurantId: number, planName: string): Promise<Subscription> {
        const plan = await this.planRepo.findOne({ where: { name: planName, isActive: true } });
        if (!plan) throw new BadRequestException('Invalid plan');
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays!);
        const sub = this.subRepo.create({
            restaurantId,
            plan: plan.name,
            price: plan.price,
            startDate,
            endDate,
            isActive: true,
        });
        const saved = await this.subRepo.save(sub);
        await this.restaurantRepo.update(restaurantId, {
            subscriptionPlan: plan.name,
            subscriptionExpiry: endDate,
        });
        return saved;
    }

    async upgradeSubscription(restaurantId: number, newPlanName: string): Promise<Subscription> {
        const current = await this.getCurrentSubscription(restaurantId, 'SUPER_ADMIN');
        if (!current) throw new NotFoundException('No active subscription');
        const newPlan = await this.planRepo.findOne({ where: { name: newPlanName, isActive: true } });
        if (!newPlan) throw new BadRequestException('Invalid plan');
        current.isActive = false;
        await this.subRepo.save(current);
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + newPlan.durationDays!);
        const newSub = this.subRepo.create({
            restaurantId,
            plan: newPlan.name,
            price: newPlan.price,
            startDate,
            endDate,
            isActive: true,
        });
        const saved = await this.subRepo.save(newSub);
        await this.restaurantRepo.update(restaurantId, {
            subscriptionPlan: newPlan.name,
            subscriptionExpiry: endDate,
        });
        return saved;
    }

    async getAllPlans() {
        return this.planRepo.find({ where: { isActive: true }, order: { createdAt: 'ASC' } });
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