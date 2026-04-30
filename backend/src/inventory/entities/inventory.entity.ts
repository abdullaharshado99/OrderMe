import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type InventoryType = 'warehouse' | 'kitchen';

@Entity('inventory')
export class Inventory {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    restaurantId?: number;

    @Column({ type: 'enum', enum: ['warehouse', 'kitchen'] })
    type?: InventoryType;

    @Column()
    itemName?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    quantity?: number;

    @Column({ nullable: true })
    unit?: string; // kg, liter, piece

    @Column({ nullable: true })
    reorderLevel?: number;

    @Column({ nullable: true })
    lastRestocked?: Date;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}