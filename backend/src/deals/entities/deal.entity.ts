import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('deals')
export class Deal {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    dealPrice?: number;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ default: true })
    isAvailable?: boolean;

    @Column({ nullable: true })
    cuisine?: string;

    @ManyToOne(() => Restaurant)
    @JoinColumn({ name: 'restaurantId' })
    restaurant?: Restaurant;

    @Column()
    restaurantId?: number;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}