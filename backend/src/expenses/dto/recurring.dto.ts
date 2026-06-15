import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateRecurringDto {
    @IsString()
    category?: string;

    @IsNumber()
    amount?: number;

    @IsIn(['monthly', 'quarterly', 'yearly'])
    frequency?: string;

    @IsOptional()
    @IsNumber()
    dayOfMonth?: number;
}