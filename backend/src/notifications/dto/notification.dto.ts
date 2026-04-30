import { IsString, IsNumber, IsOptional } from 'class-validator';

export class RegisterTokenDto {
    @IsString()
    token?: string;
}

export class SendNotificationDto {
    @IsNumber()
    userId?: number;

    @IsString()
    title?: string;

    @IsString()
    body?: string;

    @IsOptional()
    data?: Record<string, any>;
}