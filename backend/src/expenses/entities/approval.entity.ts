import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Expense } from './expense.entity';
import { User } from '../../users/entities/user.entity';

@Entity('expense_approvals')
export class ExpenseApproval {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Expense)
    @JoinColumn({ name: 'expenseId' })
    expense?: Expense;
    @Column()
    expenseId?: number;

    @Column({ default: 'pending' })
    status?: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'approvedById' })
    approvedBy?: User;
    @Column({ nullable: true })
    approvedById?: number;

    @Column({ nullable: true })
    comment?: string;

    @CreateDateColumn()
    createdAt?: Date;
}
