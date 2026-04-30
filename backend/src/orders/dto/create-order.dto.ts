import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsNumber()
    menuItemId?: number;

    @IsNumber()
    quantity?: number;
}

export class CreateOrderDto {
    @IsString()
    tableId?: string;

    @IsOptional()
    @IsString()
    customerName?: string;

    @IsOptional()
    @IsString()
    customerPhone?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items?: OrderItemDto[];
}