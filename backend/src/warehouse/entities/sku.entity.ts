import { Supplier } from './supplier.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('warehouse_skus')
export class Sku {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    skuCode?: string;

    @Column()
    name?: string;

    @Column({ nullable: true })
    category?: string;

    @Column({ nullable: true })
    binLocation?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    unitPrice?: number;

    @Column({ default: 'kg' })
    unit?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    currentStock?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    minLevel?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    maxLevel?: number;

    @Column({ default: false })
    batchTracking?: boolean;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ nullable: true })
    batchLot?: string;

    @Column({ type: 'int' })
    restaurantId?: number | null;

    @ManyToOne(() => Supplier, { nullable: true })
    @JoinColumn({ name: 'preferredSupplierId' })
    preferredSupplier?: Supplier;

    @Column({ nullable: true })
    preferredSupplierId?: number;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}