import { IsBoolean, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateSettingsDto {
    @IsOptional()
    @IsBoolean()
    allowSkipFinalExam?: boolean;

    @IsOptional()
    @IsInt()
    @Min(1)
    defaultPassPercentage?: number;

    @IsOptional()
    @IsBoolean()
    enableCertificates?: boolean;
}