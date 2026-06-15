import { User } from '../../users/entities/user.entity';
import { MenuItem } from '../../menus/entities/menu-item.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  name?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  subscriptionPlan?: string;

  @Column({ nullable: true })
  subscriptionExpiry?: Date;

  @Column({ default: true })
  isActive?: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => User, (user: User) => user.restaurantId)
  users?: User[];

  @OneToMany(() => MenuItem, (menu: MenuItem) => menu.restaurant)
  menuItems?: MenuItem[];
}