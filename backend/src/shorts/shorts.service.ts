import { Repository } from 'typeorm';
import { Short } from './entities/short.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleName } from '../roles/entities/role.entity';
import { CreateShortDto, UpdateShortDto } from './dto/short.dto';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ShortsService {
    constructor(
        @InjectRepository(Short)
        private shortRepo: Repository<Short>,
    ) { }

    async create(restaurantId: number, dto: CreateShortDto, role: string) {
        if (role !== RoleName.RESTAURANT_OWNER && role !== RoleName.SUPER_ADMIN) {
            throw new ForbiddenException();
        }
        const short = this.shortRepo.create({ ...dto, restaurantId });
        return this.shortRepo.save(short);
    }

    async findAllByRestaurant(restaurantId: number) {
        return this.shortRepo.find({ where: { restaurantId }, order: { createdAt: 'DESC' } });
    }

    async update(id: number, dto: UpdateShortDto, role: string, userRestaurantId?: number) {
        const short = await this.shortRepo.findOne({ where: { id } });
        if (!short) throw new NotFoundException();
        if (role !== RoleName.SUPER_ADMIN && short.restaurantId !== userRestaurantId) {
            throw new ForbiddenException();
        }
        Object.assign(short, dto);
        return this.shortRepo.save(short);
    }

    async delete(id: number, role: string, userRestaurantId?: number) {
        const short = await this.shortRepo.findOne({ where: { id } });
        if (!short) throw new NotFoundException();
        if (role !== RoleName.SUPER_ADMIN && short.restaurantId !== userRestaurantId) {
            throw new ForbiddenException();
        }
        return this.shortRepo.remove(short);
    }
}