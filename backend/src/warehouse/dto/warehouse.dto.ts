import { Type } from 'class-transformer';
import { TransferStatus } from '../entities/stock-transfer.entity';
import { IsString, IsOptional, IsNumber, IsEnum, Min, IsArray, ValidateNested, IsDateString } from 'class-validator';

export class CreateSkuDto {
    @IsString() skuCode?: string;
    @IsString() name?: string;
    @IsOptional() @IsString() category?: string;
    @IsString() binLocation?: string;
    @IsNumber() unitPrice?: number;
    @IsOptional() @IsString() unit?: string;
    @IsNumber() @Min(0) currentStock?: number;
    @IsNumber() @Min(0) minLevel?: number;
    @IsNumber() @Min(0) maxLevel?: number;
    @IsOptional() @IsNumber() preferredSupplierId?: number;
    @IsOptional() @IsString() batchLot?: string;
    @IsOptional() @IsNumber() restaurantId?: number | null;
}

export class CreateSupplierDto {
    @IsString() name?: string;
    @IsOptional() @IsString() contactPerson?: string;
    @IsString() phone?: string;
    @IsString() email?: string;
    @IsOptional() @IsString() address?: string;
    @IsOptional() @IsNumber() restaurantId?: number | null;
    @IsOptional() @IsString() primaryCategory?: string;
    @IsOptional() @IsNumber() leadTimeDays?: number;
    @IsOptional() @IsString() paymentTerms?: string;
}

export class CreatePurchaseOrderDto {
    @IsNumber() supplierId?: number;
    @IsOptional() @IsNumber() restaurantId?: number | null;
    @IsDateString() orderDate?: string;
    @IsDateString() expectedDelivery?: string;
    @IsOptional() @IsString() notes?: string;
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PoItemDto)
    items?: PoItemDto[];
}

class PoItemDto {
    @IsNumber() skuId?: number;
    @IsNumber() orderedQuantity?: number;
    @IsNumber() unitPrice?: number;
    @IsOptional() @IsString() notes?: string;
}

export class ReceivePurchaseOrderDto {
    @IsNumber() purchaseOrderId?: number;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReceivedItemDto)
    receivedItems?: ReceivedItemDto[];
}

class ReceivedItemDto {
    @IsNumber() skuId?: number;
    @IsNumber() receivedQuantity?: number;
    @IsOptional() @IsString() notes?: string;
}

export class CreateStockTransferDto {
    @IsString() fromLocation?: string;
    @IsString() toLocation?: string;
    @IsNumber() skuId?: number;
    @IsNumber() quantity?: number;
    @IsOptional() @IsString() notes?: string;
}

export class UpdateTransferStatusDto {
    @IsEnum(['approved', 'completed', 'cancelled'])
    status?: TransferStatus;
}