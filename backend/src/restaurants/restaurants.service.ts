import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleName } from '../roles/entities/role.entity';
import { Restaurant } from './entities/restaurant.entity';
import { MenuItem } from '../menus/entities/menu-item.entity';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,
  ) { }

  async create(dto: CreateRestaurantDto, currentUserRole: string) {
    if (currentUserRole !== RoleName.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can create restaurants');
    }
    const restaurant = this.restaurantRepository.create(dto);
    return this.restaurantRepository.save(restaurant);
  }

  async findAll(currentUserRole: string, currentUserRestaurantId?: number) {
    if (currentUserRole === RoleName.SUPER_ADMIN) {
      return this.restaurantRepository.find();
    }
    if (currentUserRestaurantId) {
      return this.restaurantRepository.find({ where: { id: currentUserRestaurantId } });
    }
    throw new ForbiddenException('Access denied');
  }

  async findOne(id: number, currentUserRole: string, currentUserRestaurantId?: number) {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (currentUserRole === RoleName.SUPER_ADMIN) return restaurant;
    if (currentUserRestaurantId === id) return restaurant;
    throw new ForbiddenException('Access denied');
  }

  async update(id: number, dto: UpdateRestaurantDto, currentUserRole: string, currentUserRestaurantId?: number) {
    if (currentUserRole !== RoleName.SUPER_ADMIN && currentUserRestaurantId !== id) {
      throw new ForbiddenException('Access denied');
    }
    const restaurant = await this.findOne(id, currentUserRole, currentUserRestaurantId);
    Object.assign(restaurant, dto);
    return this.restaurantRepository.save(restaurant);
  }

  async delete(id: number, currentUserRole: string) {
    if (currentUserRole !== RoleName.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can delete restaurants');
    }
    const restaurant = await this.findOne(id, currentUserRole, undefined);
    return this.restaurantRepository.remove(restaurant);
  }

  async getCuisines(restaurantId: number) {
    const items = await this.menuItemRepo.find({ where: { restaurantId } });
    const cuisinesMap = new Map<string, string>();
    for (const item of items) {
      if (item.cuisine && !cuisinesMap.has(item.cuisine)) {
        cuisinesMap.set(item.cuisine, 'https://via.placeholder.com/400');
      }
    }
    const cuisines = Array.from(cuisinesMap.entries()).map(([name, thumbnailUrl]) => ({
      id: name.toLowerCase().replace(/\s/g, '-'),
      name,
      thumbnailUrl,
    }));
    return cuisines;
  }
}