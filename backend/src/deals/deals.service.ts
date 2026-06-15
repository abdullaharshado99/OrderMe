import { Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleName } from '../roles/entities/role.entity';
import { CreateDealDto, UpdateDealDto } from './dto/deal.dto';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class DealsService {
    constructor(
        @InjectRepository(Deal)
        private dealRepo: Repository<Deal>,
    ) { }

    async create(restaurantId: number, dto: CreateDealDto, role: string) {
        if (role !== RoleName.RESTAURANT_OWNER && role !== RoleName.SUPER_ADMIN) {
            throw new ForbiddenException();
        }
        const deal = this.dealRepo.create({ ...dto, restaurantId });
        return this.dealRepo.save(deal);
    }

    async findAllByRestaurant(restaurantId: number, cuisine?: string) {
        const where: any = { restaurantId, isAvailable: true };
        if (cuisine) where.cuisine = cuisine;
        return this.dealRepo.find({ where, order: { createdAt: 'DESC' } });
    }

    async update(id: number, dto: UpdateDealDto, role: string, userRestaurantId?: number) {
        const deal = await this.dealRepo.findOne({ where: { id } });
        if (!deal) throw new NotFoundException();
        if (role !== RoleName.SUPER_ADMIN && deal.restaurantId !== userRestaurantId) {
            throw new ForbiddenException();
        }
        Object.assign(deal, dto);
        return this.dealRepo.save(deal);
    }

    async delete(id: number, role: string, userRestaurantId?: number) {
        const deal = await this.dealRepo.findOne({ where: { id } });
        if (!deal) throw new NotFoundException();
        if (role !== RoleName.SUPER_ADMIN && deal.restaurantId !== userRestaurantId) {
            throw new ForbiddenException();
        }
        return this.dealRepo.remove(deal);
    }
}