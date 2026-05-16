import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pos_carts')
export class Cart {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: true })
    tableId?: number;

    @Column({ nullable: true })
    terminalLabel?: string;

    @Column({ nullable: true })
    restaurantId?: number;

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