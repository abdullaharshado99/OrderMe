import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price?: number;

  @Column({ nullable: true })
  category?: string; // e.g., appetizer, main, dessert

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: true })
  isAvailable?: boolean;

  @Column({ nullable: true })
  preparationTime?: number; // in minutes

  @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.menuItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' })
  restaurant?: Restaurant;

  @Column()
  restaurantId?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}