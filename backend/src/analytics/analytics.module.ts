import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { Order } from '../orders/entities/order.entity';
import { AnalyticsController } from './analytics.controller';
import { Expense } from '../expenses/entities/expense.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Expense, Restaurant])],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
})
export class AnalyticsModule { }