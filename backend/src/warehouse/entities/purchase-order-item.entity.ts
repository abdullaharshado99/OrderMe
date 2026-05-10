import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Sku } from './sku.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => PurchaseOrder, po => po.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'purchaseOrderId' })
    purchaseOrder?: PurchaseOrder;

    @Column()
    purchaseOrderId?: number;

    @ManyToOne(() => Sku)
    @JoinColumn({ name: 'skuId' })
    sku?: Sku;

    @Column()
    skuId?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    orderedQuantity?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    receivedQuantity?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    unitPrice?: number;

    @Column({ type: 'text', nullable: true })
    notes?: string;
}