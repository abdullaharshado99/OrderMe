import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('pos_carts')
export class Cart {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: true })
    sessionId?: string;

    @Column({ nullable: true })
    userId?: number;

    @Column({ nullable: true })
    tableId?: number;

    @Column({ type: 'int' })
    restaurantId?: number | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'cashierUserId' })
    cashier?: User | null;

    @Column({ nullable: true })
    cashierUserId?: number | null;

    @Column({ nullable: true })
    terminalLabel?: string;

    @Column({ type: 'jsonb', default: [] })
    items?: Array<{ menuItemId: number; name: string; quantity: number; price: number; modifiers?: string[] }>;

    @Column({ default: 0 })
    discountPercent?: number;

    @Column({ default: 0 })
    discountAmount?: number;

    @Column({ default: 0 })
    tax?: number;

    @Column({ default: 0 })
    serviceCharge?: number;

    @Column({ default: 'dine-in' })
    orderType?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
