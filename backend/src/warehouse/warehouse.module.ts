import { Module } from '@nestjs/common';
import { Sku } from './entities/sku.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { AuditLog } from './entities/audit-log.entity';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { StockTransfer } from './entities/stock-transfer.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sku, Supplier, PurchaseOrder, PurchaseOrderItem, StockTransfer, AuditLog])],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule { }