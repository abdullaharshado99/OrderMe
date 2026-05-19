import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateRecipeDto {
    @IsString() name?: string;
    @IsOptional() @IsString() description?: string;
    @IsNumber() @Min(0.1) yieldQuantity?: number;
    @IsOptional() @IsNumber() prepTimeMinutes?: number;
    @IsOptional() ingredients?: { skuId: number; quantity: number }[];
}

export class CreatePrepTaskDto {
    @IsDateString() date?: string;
    @IsNumber() skuId?: number;
    @IsNumber() @Min(0) targetQuantity?: number;
}

export class UpdatePrepTaskDto {
    @IsNumber() @Min(0) completedQuantity?: number;
}

export class CreateWasteLogDto {
    @IsNumber() skuId?: number;
    @IsNumber() @Min(0) quantity?: number;
    @IsString() reason?: string;
}