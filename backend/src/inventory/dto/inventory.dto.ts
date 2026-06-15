import { InventoryType } from '../entities/inventory.entity';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateInventoryDto {
    @IsEnum(['warehouse', 'kitchen'])
    type?: InventoryType;

    @IsString()
    itemName?: string;

    @IsNumber()
    quantity?: number;

    @IsOptional()
    @IsString()
    unit?: string;

    @IsOptional()
    @IsNumber()
    reorderLevel?: number;
}