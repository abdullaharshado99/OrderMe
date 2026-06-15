import { IsString } from 'class-validator';

export class CreateFactDto {
    @IsString()
    fact?: string;
}