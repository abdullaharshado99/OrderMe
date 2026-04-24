import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

class ExamQuestionDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number;

  @IsString()
  @IsIn(['translation', 'tafseer'])
  sectionName: 'translation' | 'tafseer';

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class CreateExamDto {
  @IsInt()
  paraId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @Min(1)
  passPercentage: number;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsArray()
  questions: ExamQuestionDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateExamDto extends PartialType(CreateExamDto) { }