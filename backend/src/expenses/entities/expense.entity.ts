import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('expenses')
export class Expense {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    restaurantId?: number;

    @Column()
    category?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount?: number;

    @Column({ nullable: true, type: 'text' })
    description?: string;

    @Column({ nullable: true })
    date?: Date;

    @Column({ nullable: true })
    receiptUrl?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}