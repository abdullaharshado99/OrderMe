import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('shorts')
export class Short {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column({ nullable: true })
    thumbnailUrl?: string;

    @Column()
    videoUrl?: string;

    @Column({ default: false })
    isNew?: boolean;

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