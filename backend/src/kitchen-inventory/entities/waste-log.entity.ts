import { User } from '../../users/entities/user.entity';
import { Sku } from '../../warehouse/entities/sku.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('waste_logs')
export class WasteLog {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Sku)
    @JoinColumn({ name: 'skuId' })
    sku?: Sku;
    @Column()
    skuId?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    quantity?: number;

    @Column()
    reason?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    estimatedCost?: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'reportedById' })
    reportedBy?: User;
    @Column()
    reportedById?: number;

    @CreateDateColumn()
    createdAt?: Date;
}