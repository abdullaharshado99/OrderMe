import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('recurring_expenses')
export class RecurringExpense {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    restaurantId?: number;

    @Column()
    category?: string;

    @Column('decimal', { precision: 12, scale: 2 })
    amount?: number;

    @Column()
    frequency?: string;

    @Column({ nullable: true })
    dayOfMonth?: number;

    @Column({ default: true })
    isActive?: boolean;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
