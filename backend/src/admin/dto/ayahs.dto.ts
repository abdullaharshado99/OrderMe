import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, IsArray, ValidateNested } from 'class-validator';

export class UpsertAyahDto {
  @IsInt()
  @Min(1)
  ayahNumber: number;

  @IsInt()
  paraId: number;

  @IsInt()
  rukuId: number;

  @IsOptional()
  @IsInt()
  surahId?: number;

  @IsString()
  @IsNotEmpty()
  arabicText: string;

  @IsOptional()
  @IsInt()
  numberInSurah?: number;

  @IsOptional()
  @IsInt()
  juz?: number;

  @IsOptional()
  @IsInt()
  manzil?: number;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  hizbQuarter?: number;

  @IsOptional()
  sajda?: boolean;
}

export class BulkAyahUploadDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertAyahDto)
  items: UpsertAyahDto[];
}