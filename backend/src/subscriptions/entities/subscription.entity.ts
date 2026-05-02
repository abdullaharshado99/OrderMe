import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    restaurantId?: number;

    @Column()
    plan?: string; // basic, pro, enterprise

    @Column('decimal', { precision: 10, scale: 2 })
    price?: number;

    @ManyToOne(() => Restaurant)
    @JoinColumn({ name: 'restaurantId' })
    restaurant?: Restaurant;

    @Column()
    startDate?: Date;

    @Column()
    endDate?: Date;

    @Column({ default: true })
    isActive?: boolean;

    @Column({ nullable: true })
    stripePaymentId?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}