import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { ExpensesService } from './expenses.service';
import { ExpenseBudget } from './entities/budget.entity';
import { ExpensesController } from './expenses.controller';
import { ExpenseApproval } from './entities/approval.entity';
import { RecurringExpense } from './entities/recurring-expense.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Expense, ExpenseBudget, ExpenseApproval, RecurringExpense])],
    controllers: [ExpensesController],
    providers: [ExpensesService],
})
export class ExpensesModule { }