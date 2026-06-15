import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/inventory.dto';
import { RoleName } from '../roles/entities/role.entity';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
    ) { }

    async create(restaurantId: number, dto: CreateInventoryDto, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        const item = this.inventoryRepository.create({ ...dto, restaurantId });
        return this.inventoryRepository.save(item);
    }

    async findAll(restaurantId: number, type: string | undefined, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        const where: any = { restaurantId };
        if (type) where.type = type;
        return this.inventoryRepository.find({ where });
    }

    async update(id: number, dto: Partial<CreateInventoryDto>, currentUserRole: string, userRestaurantId?: number) {
        const item = await this.inventoryRepository.findOne({ where: { id } });
        if (!item) throw new NotFoundException('Inventory item not found');
        this.checkAccess(item.restaurantId ?? 0, currentUserRole, userRestaurantId);
        Object.assign(item, dto);
        return this.inventoryRepository.save(item);
    }

    async delete(id: number, currentUserRole: string, userRestaurantId?: number) {
        const item = await this.inventoryRepository.findOne({ where: { id } });
        if (!item) throw new NotFoundException('Inventory item not found');
        this.checkAccess(item.restaurantId ?? 0, currentUserRole, userRestaurantId);
        return this.inventoryRepository.remove(item);
    }

    private checkAccess(restaurantId: number, role: string, userRestaurantId?: number) {
        if (role === RoleName.SUPER_ADMIN) return;
        if (role === RoleName.RESTAURANT_OWNER && userRestaurantId === restaurantId) return;
        throw new ForbiddenException('Access denied');
    }
}