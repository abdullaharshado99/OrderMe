import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('subscription_plans', { synchronize: false })
export class SubscriptionPlan {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ name: 'name', unique: true })
    name?: string;

    @Column('decimal', { name: 'price', precision: 10, scale: 2 })
    price?: number;

    @Column({ name: 'durationdays' })
    durationDays?: number;

    @Column({ name: 'features', nullable: true })
    features?: string;

    @Column({ name: 'is_active', default: true })
    isActive?: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt?: Date;
}
