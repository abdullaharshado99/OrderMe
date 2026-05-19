import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantTable } from './entities/table.entity';
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';
import { RoleName } from '../roles/entities/role.entity';

@Injectable()
export class TablesService {
    constructor(
        @InjectRepository(RestaurantTable)
        private tableRepo: Repository<RestaurantTable>,
    ) { }

    async create(restaurantId: number, dto: CreateTableDto, userRole: string) {
        if (userRole !== RoleName.SUPER_ADMIN && userRole !== RoleName.RESTAURANT_OWNER) {
            throw new ForbiddenException();
        }
        const table = this.tableRepo.create({ restaurantId, ...dto });
        return this.tableRepo.save(table);
    }

    async findAllByRestaurant(restaurantId: number, userRole: string, userRestaurantId?: number) {
        if (userRole !== RoleName.SUPER_ADMIN && userRestaurantId !== restaurantId) {
            throw new ForbiddenException();
        }
        return this.tableRepo.find({ where: { restaurantId }, order: { tableNumber: 'ASC' } });
    }

    async update(id: number, dto: UpdateTableDto, userRole: string, userRestaurantId?: number) {
        const table = await this.tableRepo.findOne({ where: { id } });
        if (!table) throw new NotFoundException();
        if (userRole !== RoleName.SUPER_ADMIN && userRestaurantId !== table.restaurantId) {
            throw new ForbiddenException();
        }
        Object.assign(table, dto);
        return this.tableRepo.save(table);
    }

    async delete(id: number, userRole: string, userRestaurantId?: number) {
        const table = await this.tableRepo.findOne({ where: { id } });
        if (!table) throw new NotFoundException();
        if (userRole !== RoleName.SUPER_ADMIN && userRestaurantId !== table.restaurantId) {
            throw new ForbiddenException();
        }
        return this.tableRepo.remove(table);
    }
}