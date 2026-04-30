import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Order } from '../orders/entities/order.entity';
import { Expense } from '../expenses/entities/expense.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Expense])],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
})
export class AnalyticsModule { }