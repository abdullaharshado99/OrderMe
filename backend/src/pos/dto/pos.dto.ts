import { PaymentMethod } from '../entities/payment.entity';
import { IsNumber, IsOptional, IsString, Min, IsArray, IsIn, Max } from 'class-validator';

const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'card', 'jazzcash', 'easypaisa'];

export class AddItemDto {
    @IsNumber() menuItemId?: number;
    @IsString() name?: string;
    @IsNumber() @Min(1) quantity?: number;
    @IsNumber() price?: number;
    @IsOptional() @IsArray() modifiers?: string[];
}

export class UpdateQuantityDto {
    @IsNumber() menuItemId?: number;
    @IsNumber() @Min(0) quantity?: number;
}

export class ApplyDiscountDto {
    @IsNumber() @Min(0) @Max(100) percent?: number;
}

export class CheckoutDto {
    @IsIn(PAYMENT_METHODS)
    paymentMethod?: PaymentMethod;
}

export class CreateCartDto {
    @IsOptional() @IsNumber() tableId?: number;
    @IsOptional() @IsString() terminalLabel?: string;
    @IsOptional()
    @IsIn(['dine-in', 'takeaway', 'delivery'])
    orderType?: string;
}