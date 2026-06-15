import { Sku } from './sku.entity';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export type TransferStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

@Entity('stock_transfers')
export class StockTransfer {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    fromLocation?: string;

    @Column()
    toLocation?: string;

    @ManyToOne(() => Sku)
    @JoinColumn({ name: 'skuId' })
    sku?: Sku;

    @Column()
    skuId?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    quantity?: number;

    @Column({ type: 'enum', enum: ['pending', 'approved', 'completed', 'cancelled'], default: 'pending' })
    status?: TransferStatus;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'requestedById' })
    requestedBy?: User;

    @Column()
    requestedById?: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'approvedById' })
    approvedBy?: User | null;

    @Column({ nullable: true })
    approvedById?: number;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt?: Date;

    @Column({ nullable: true })
    notes?: string;

    @Column({ type: 'int' })
    restaurantId?: number | null;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}