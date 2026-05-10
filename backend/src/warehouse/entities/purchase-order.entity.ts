import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Supplier } from './supplier.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

export type PoStatus = 'draft' | 'pending' | 'in-transit' | 'received' | 'cancelled';

@Entity('purchase_orders')
export class PurchaseOrder {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    poNumber?: string;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplierId' })
    supplier?: Supplier;

    @Column()
    supplierId?: number;

    @Column({ type: 'enum', enum: ['draft', 'pending', 'in-transit', 'received', 'cancelled'], default: 'draft' })
    status?: PoStatus;

    @Column({ type: 'date', nullable: true })
    orderDate?: Date;

    @Column({ type: 'date', nullable: true })
    expectedDelivery?: Date;

    @Column({ type: 'int' })   // ✅ explicitly define as integer column
    restaurantId?: number

    @Column({ nullable: true })
    notes?: string;

    @OneToMany(() => PurchaseOrderItem, (item: any) => item.purchaseOrder, { cascade: true })
    items?: PurchaseOrderItem[];

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}