import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateBudgetDto {
    @IsString()
    category?: string;

    @IsNumber()
    amount?: number;

    @IsDateString()
    month?: string;
}