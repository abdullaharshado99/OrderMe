import { Module } from '@nestjs/common';
import { PosService } from './pos.service';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosController } from './pos.controller';
import { Payment } from './entities/payment.entity';
import { User } from '../users/entities/user.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Payment, User]), OrdersModule],
  controllers: [PosController],
  providers: [PosService],
})
export class PosModule { }