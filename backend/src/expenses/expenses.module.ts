import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { Expense } from './entities/expense.entity';
import { ExpenseBudget } from './entities/budget.entity';
import { ExpenseApproval } from './entities/approval.entity';
import { RecurringExpense } from './entities/recurring-expense.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Expense, ExpenseBudget, ExpenseApproval, RecurringExpense])],
    controllers: [ExpensesController],
    providers: [ExpensesService],
})
export class ExpensesModule { }