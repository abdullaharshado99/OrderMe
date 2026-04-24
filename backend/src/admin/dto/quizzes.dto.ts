import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateSimpleQuizDto {
    @IsInt()
    rukuId: number;

    @IsOptional()
    @IsInt()
    paraId?: number;

    @IsOptional()
    @IsInt()
    surahId?: number;

    @IsString()
    @IsNotEmpty()
    question: string;

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(4)
    options: string[];

    @IsString()
    @IsNotEmpty()
    correctAnswer: string;

    @IsOptional()
    @IsString()
    explanation?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateSimpleQuizDto extends PartialType(CreateSimpleQuizDto) { }