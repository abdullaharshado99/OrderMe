import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sku } from '../../warehouse/entities/sku.entity';

@Entity('prep_tasks')
export class PrepTask {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    date?: Date;

    @ManyToOne(() => Sku)
    @JoinColumn({ name: 'skuId' })
    sku?: Sku;
    @Column()
    skuId?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    targetQuantity?: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    completedQuantity?: number;

    @Column({ default: 'pending' })
    status?: string;

    @CreateDateColumn()
    createdAt?: Date;
}
