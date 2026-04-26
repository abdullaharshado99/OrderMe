import { IsString, IsNumber } from 'class-validator';

export class GenerateQRDto {
    @IsNumber()
    restaurantId?: number;

    @IsString()
    tableId?: string;
}