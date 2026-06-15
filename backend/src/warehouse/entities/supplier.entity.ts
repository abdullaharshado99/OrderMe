import { Sku } from './sku.entity';
import { PurchaseOrder } from './purchase-order.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('suppliers')
export class Supplier {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column({ nullable: true })
    contactPerson?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ type: 'int' })
    restaurantId?: number | null;

    @Column({ nullable: true })
    primaryCategory?: string;

    @Column({ nullable: true })
    leadTimeDays?: number;

    @Column({ nullable: true })
    paymentTerms?: string;

    @Column('decimal', { precision: 2, scale: 1, default: 0 })
    rating?: number;

    @Column({ default: true })
    isActive?: boolean;

    @OneToMany(() => Sku, sku => sku.preferredSupplier)
    skus?: Sku[];

    @OneToMany(() => PurchaseOrder, po => po.supplier)
    purchaseOrders?: PurchaseOrder[];

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}