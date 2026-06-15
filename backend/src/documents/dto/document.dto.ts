import { IsString, IsNumber } from 'class-validator';

export class UploadDocumentDto {
    @IsNumber()
    restaurantId?: number;

    @IsString()
    fileName?: string;

    @IsString()
    fileType?: string;
}