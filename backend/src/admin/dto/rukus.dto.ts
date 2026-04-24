import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';

class DosDontsDto {
  @IsArray()
  @IsString({ each: true })
  dos: string[];

  @IsArray()
  @IsString({ each: true })
  donts: string[];
}

export class AyahReferenceDto {
  @IsInt()
  @Min(1)
  surahNumber: number;

  @IsInt()
  @Min(1)
  ayahNumber: number;
}

export class CreateRukuDto {
  @IsInt()
  @Min(1)
  rukuNumber: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  paraId: number;

  @IsOptional()
  @IsInt()
  surahId?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  ayahNumbers?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AyahReferenceDto)
  ayahReferences?: AyahReferenceDto[];
}

export class UpdateRukuDto extends CreateRukuDto { }