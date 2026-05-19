import { IsNumber, IsOptional, IsEnum, IsString } from 'class-validator';

export class CreateTableDto {
    @IsNumber()
    tableNumber?: number;

    @IsOptional()
    @IsEnum(['free', 'occupied', 'reserved'])
    status?: 'free' | 'occupied' | 'reserved';
}

export class UpdateTableDto {
    @IsOptional()
    @IsNumber()
    tableNumber?: number;

    @IsOptional()
    @IsEnum(['free', 'occupied', 'reserved'])
    status?: 'free' | 'occupied' | 'reserved';
}