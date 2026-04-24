import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSurahDto {
  @IsInt()
  @Min(1)
  surahNumber: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  englishName?: string;

  @IsInt()
  @IsOptional()
  startingPage?: number;

  @IsInt()
  @IsOptional()
  endingPage?: number;

  @IsString()
  @IsOptional()
  englishNameTranslation?: string;

  @IsString()
  @IsOptional()
  revelationType?: string;

  @IsInt()
  @IsOptional()
  numberOfAyahs?: number;

  @IsInt()
  @IsOptional()
  revelationOrder?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  paraIds?: number[];
}

export class UpdateSurahDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  surahNumber?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  englishName?: string;

  @IsOptional()
  @IsInt()
  startingPage?: number;

  @IsOptional()
  @IsInt()
  endingPage?: number;

  @IsOptional()
  @IsString()
  englishNameTranslation?: string;

  @IsOptional()
  @IsString()
  revelationType?: string;

  @IsOptional()
  @IsInt()
  numberOfAyahs?: number;

  @IsOptional()
  @IsInt()
  revelationOrder?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  paraIds?: number[];
}

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;
}