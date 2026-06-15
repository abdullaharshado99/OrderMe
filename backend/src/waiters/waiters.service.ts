import { Repository } from 'typeorm';
import { Waiter } from './entities/waiter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleName } from '../roles/entities/role.entity';
import { CreateWaiterDto, UpdateWaiterDto } from './dto/waiter.dto';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class WaitersService {
    constructor(
        @InjectRepository(Waiter)
        private waiterRepo: Repository<Waiter>,
    ) { }

    async create(restaurantId: number, dto: CreateWaiterDto, userRole: string) {
        if (userRole !== RoleName.SUPER_ADMIN && userRole !== RoleName.RESTAURANT_OWNER) {
            throw new ForbiddenException();
        }
        const waiter = this.waiterRepo.create({ restaurantId, ...dto });
        return this.waiterRepo.save(waiter);
    }

    async findAllByRestaurant(restaurantId: number, userRole: string, userRestaurantId?: number) {
        if (userRole !== RoleName.SUPER_ADMIN && userRestaurantId !== restaurantId) {
            throw new ForbiddenException();
        }
        return this.waiterRepo.find({ where: { restaurantId, isActive: true }, order: { name: 'ASC' } });
    }

    async update(id: number, dto: UpdateWaiterDto, userRole: string, userRestaurantId?: number) {
        const waiter = await this.waiterRepo.findOne({ where: { id } });
        if (!waiter) throw new NotFoundException();
        if (userRole !== RoleName.SUPER_ADMIN && userRestaurantId !== waiter.restaurantId) {
            throw new ForbiddenException();
        }
        Object.assign(waiter, dto);
        return this.waiterRepo.save(waiter);
    }

    async delete(id: number, userRole: string, userRestaurantId?: number) {
        const waiter = await this.waiterRepo.findOne({ where: { id } });
        if (!waiter) throw new NotFoundException();
        if (userRole !== RoleName.SUPER_ADMIN && userRestaurantId !== waiter.restaurantId) {
            throw new ForbiddenException();
        }
        return this.waiterRepo.remove(waiter);
    }
}