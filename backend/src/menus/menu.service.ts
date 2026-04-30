import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/menu-item.dto';
import { RoleName } from '../roles/entities/role.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(MenuItem)
    private menuRepository: Repository<MenuItem>,
  ) { }

  async create(restaurantId: number, dto: CreateMenuItemDto, currentUserRole: string, currentUserRestaurantId?: number) {
    this.checkRestaurantAccess(restaurantId, currentUserRole, currentUserRestaurantId);
    const item = this.menuRepository.create({ ...dto, restaurantId });
    return this.menuRepository.save(item);
  }

  async findAllByRestaurant(restaurantId: number, currentUserRole: string, currentUserRestaurantId?: number) {
    // Customer and any authenticated user can view menu (no strict restriction)
    return this.menuRepository.find({ where: { restaurantId, isAvailable: true } });
  }

  async update(id: number, dto: Partial<CreateMenuItemDto>, currentUserRole: string, currentUserRestaurantId?: number) {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    this.checkRestaurantAccess(item.restaurantId ?? 0, currentUserRole, currentUserRestaurantId);
    Object.assign(item, dto);
    return this.menuRepository.save(item);
  }

  async delete(id: number, currentUserRole: string, currentUserRestaurantId?: number) {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    this.checkRestaurantAccess(item.restaurantId ?? 0, currentUserRole, currentUserRestaurantId);
    return this.menuRepository.remove(item);
  }

  private checkRestaurantAccess(restaurantId: number, role: string, userRestaurantId?: number) {
    if (role === RoleName.SUPER_ADMIN) return;
    if (role === RoleName.RESTAURANT_OWNER && userRestaurantId === restaurantId) return;
    throw new ForbiddenException('Access denied');
  }
}