import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateParaDto {
  @IsInt()
  @Min(1)
  paraNumber: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @Min(1)
  numberOfSurahs: number;

  @IsInt()
  @Min(1)
  numberOfAyahs: number;
}

export class UpdateParaDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  paraNumber?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  numberOfSurahs?: number;

  @IsOptional()
  @IsInt()
  numberOfAyahs?: number;
}

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 30;

  @IsOptional()
  @IsString()
  search?: string;
}