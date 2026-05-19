import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { Sku } from './entities/sku.entity';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { StockTransfer } from './entities/stock-transfer.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sku, Supplier, PurchaseOrder, PurchaseOrderItem, StockTransfer, AuditLog])],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule { }