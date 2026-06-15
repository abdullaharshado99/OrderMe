import { PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class CreateDealDto {
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    dealPrice?: number;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @IsOptional()
    @IsString()
    cuisine?: string;
}

export class UpdateDealDto extends PartialType(CreateDealDto) { }