import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class CreateShortDto {
    @IsString()
    title?: string;

    @IsOptional()
    @IsUrl()
    thumbnailUrl?: string;

    @IsUrl()
    videoUrl?: string;

    @IsOptional()
    @IsBoolean()
    isNew?: boolean;
}

export class UpdateShortDto extends PartialType(CreateShortDto) { }