import { IsString, IsOptional, IsBoolean, IsIn, IsEmail } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsIn(['basic', 'pro', 'enterprise'])
  subscriptionPlan?: string;
}

export class UpdateRestaurantDto extends CreateRestaurantDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}