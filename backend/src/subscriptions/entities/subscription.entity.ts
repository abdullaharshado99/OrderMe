import { SubscriptionPlan } from './subscription-plan.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    restaurantId?: number;

    @Column()
    plan?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price?: number;

    @ManyToOne(() => SubscriptionPlan)
    @JoinColumn({ name: 'planId' })
    planRef?: SubscriptionPlan;

    @Column({ nullable: true })
    planId?: number;

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