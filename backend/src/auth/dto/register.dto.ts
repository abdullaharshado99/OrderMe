import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { RoleName } from '../../roles/entities/role.entity';

export class RegisterDto {
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(RoleName)
  role?: RoleName;

  @IsNumber()
  @IsOptional()
  restaurantId?: number;
}

export class LoginDto {
  @IsEmail()
  email?: string;

  @IsString()
  password?: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken?: string;
}