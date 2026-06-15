import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
    @IsNumber()
    restaurantId?: number;

    @IsString()
    plan?: string;

    @IsNumber()
    price?: number;

    @IsDateString()
    startDate?: string;

    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsString()
    stripePaymentId?: string;
}

export class RenewSubscriptionDto {
    @IsString()
    plan?: string;

    @IsNumber()
    price?: number;

    @IsDateString()
    startDate?: string;

    @IsDateString()
    endDate?: string;
}