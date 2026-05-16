import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ApproveExpenseDto {
    @IsOptional()
    @IsString()
    comment?: string;
}