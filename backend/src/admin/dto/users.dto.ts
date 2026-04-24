import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateAdminUserDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    name?: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}