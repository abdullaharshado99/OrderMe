import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role, RoleName } from '../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) { }

  async findAll(restaurantId?: number, currentUserRole?: string, currentUserRestaurantId?: number) {
    // Super admin can see all users
    if (currentUserRole === RoleName.SUPER_ADMIN) {
      return this.userRepository.find({ relations: ['role'] });
    }
    // Restaurant owner and chef see only users in their restaurant
    if (restaurantId && currentUserRestaurantId === restaurantId) {
      return this.userRepository.find({ where: { restaurantId }, relations: ['role'] });
    }
    throw new ForbiddenException('Access denied');
  }

  async findOne(id: number, currentUserRole?: string, currentUserRestaurantId?: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] });
    if (!user) throw new NotFoundException('User not found');

    if (currentUserRole === RoleName.SUPER_ADMIN) return user;
    if (currentUserRestaurantId === user.restaurantId) return user;
    throw new ForbiddenException('Access denied');
  }

  async updateProfile(id: number, updateData: Partial<User>, currentUserId: number, currentUserRole: string) {
    if (id !== currentUserId && currentUserRole !== RoleName.SUPER_ADMIN) {
      throw new ForbiddenException('You can only update your own profile');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number, currentUserRole: string, currentUserRestaurantId?: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (currentUserRole === RoleName.SUPER_ADMIN) {
      await this.userRepository.remove(user);
      return { message: 'User deleted' };
    }
    if (currentUserRole === RoleName.RESTAURANT_OWNER && user.restaurantId === currentUserRestaurantId) {
      await this.userRepository.remove(user);
      return { message: 'User deleted' };
    }
    throw new ForbiddenException('Access denied');
  }

  async assignRole(userId: number, roleName: RoleName, currentUserRole: string) {
    if (currentUserRole !== RoleName.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can assign roles');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) throw new BadRequestException('Invalid role');
    user.roleId = role.id;
    return this.userRepository.save(user);
  }

  async findByRestaurant(restaurantId: number, role?: RoleName, currentUserRole?: string, currentUserRestaurantId?: number) {
    if (currentUserRole !== RoleName.SUPER_ADMIN && currentUserRestaurantId !== restaurantId) {
      throw new ForbiddenException('Access denied');
    }
    const where: any = { restaurantId };
    if (role) where.role = { name: role };
    return this.userRepository.find({ where, relations: ['role'] });
  }
}
