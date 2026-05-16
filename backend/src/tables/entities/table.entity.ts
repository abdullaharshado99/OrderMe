import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

export type TableStatus = 'free' | 'occupied' | 'reserved';

@Entity('restaurant_tables')
export class RestaurantTable {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    restaurantId?: number;

    @ManyToOne(() => Restaurant)
    @JoinColumn({ name: 'restaurantId' })
    restaurant?: Restaurant;

    @Column()
    tableNumber?: number;

    @Column({ type: 'enum', enum: ['free', 'occupied', 'reserved'], default: 'free' })
    status?: TableStatus;

    @Column({ nullable: true })
    qrCodeUrl?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}