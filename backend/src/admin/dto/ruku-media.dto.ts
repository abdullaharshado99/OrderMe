import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

const MAX_ITEM_LEN = 20_000;
const MAX_MAIN = 100_000;

export class CreateRukuMediaDto {
  @ApiProperty({ description: 'Database id of the ruku row' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rukuId: number;

  @ApiProperty({ example: 1, required: true })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  paraId: number;

  @ApiProperty({ example: 1, required: true })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  surahId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(MAX_MAIN, { each: true })
  mainPoints?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(MAX_ITEM_LEN, { each: true })
  dos?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(MAX_ITEM_LEN, { each: true })
  donts?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(MAX_ITEM_LEN, { each: true })
  commitments?: string[];
}

export class UpdateRukuMediaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(MAX_MAIN, { each: true })
  mainPoints?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(MAX_ITEM_LEN, { each: true })
  dos?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(MAX_ITEM_LEN, { each: true })
  donts?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(MAX_ITEM_LEN, { each: true })
  commitments?: string[];
}