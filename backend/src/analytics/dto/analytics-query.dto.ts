import { Transform } from 'class-transformer';
import { IsOptional, IsEnum, IsNumber, Min } from 'class-validator';

export class SalesReportQueryDto {
    @IsEnum(['daily', 'weekly', 'monthly'])
    period!: 'daily' | 'weekly' | 'monthly';
}

export class PopularItemsQueryDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    limit?: number = 5;
}