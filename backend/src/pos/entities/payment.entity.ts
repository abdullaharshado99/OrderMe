import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type PaymentMethod = 'cash' | 'card' | 'jazzcash' | 'easypaisa';

@Entity('pos_payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    orderId?: number;

    @Column({ type: 'enum', enum: ['cash', 'card', 'jazzcash', 'easypaisa'] })
    method?: PaymentMethod;

    @Column('decimal', { precision: 10, scale: 2 })
    amount?: number;

    @Column({ nullable: true })
    reference?: string; // transaction ID

    @CreateDateColumn()
    createdAt?: Date;
}