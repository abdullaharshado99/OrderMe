import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Sku } from './sku.entity';

@Entity('warehouse_audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Sku)
    @JoinColumn({ name: 'skuId' })
    sku?: Sku;

    @Column()
    skuId?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    previousStock?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    newStock?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    adjustment?: number; // positive or negative

    @Column()
    reason?: string; // e.g., 'stock take', 'damaged', 'received'

    @Column({ type: 'int' })
    restaurantId?: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user?: User;

    @Column()
    userId?: number;

    @CreateDateColumn()
    createdAt?: Date;
}