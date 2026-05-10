import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type OrderStatus = 'pending' | 'confirmed' | 'cooking' | 'ready' | 'delivered' | 'cancelled';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    restaurantId?: number;

    @Column({ nullable: true })
    tableId?: string; // QR table identifier

    @Column({ nullable: true })
    customerName?: string;

    @Column({ nullable: true })
    customerPhone?: string;

    @Column({ type: 'jsonb' })
    items?: Array<{
        menuItemId: number;
        name: string;
        quantity: number;
        price: number;
    }>;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount?: number;

    @Column({ type: 'enum', enum: ['pending', 'confirmed', 'cooking', 'ready', 'delivered', 'cancelled'], default: 'pending' })
    status?: OrderStatus;

    @Column({ nullable: true })
    assignedChefId?: number; // user id with role chef

    @Column({ nullable: true })
    estimatedTime?: number; // in minutes

    // add to existing entity:
    @Column({ nullable: true })
    station?: string; // 'grill', 'pasta', 'cold', etc.

    @Column({ nullable: true, type: 'timestamp' })
    routingTime?: Date;

    @Column({ nullable: true })
    priority?: string; // 'rush', 'vip', 'normal'

    @Column({ nullable: true, type: 'timestamp' })
    cookTimeStart?: Date;

    @Column({ nullable: true, type: 'timestamp' })
    cookTimeEnd?: Date;

    @Column({ nullable: true })
    bumpedBy?: string;

    @Column({ nullable: true, type: 'timestamp' })
    bumpedAt?: Date;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}