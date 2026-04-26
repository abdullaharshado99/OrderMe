import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/create-restaurant.dto';
import { RoleName } from '../roles/entities/role.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
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
}