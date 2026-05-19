import { IsString, IsNumber, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  cuisine?: string;   // e.g., 'Pakistani', 'Italian'

  @IsOptional()
  @IsString()
  foodCategory?: string; // e.g., 'Karahi', 'Pizza'

  // optional legacy field
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  preparationTime?: number;
}