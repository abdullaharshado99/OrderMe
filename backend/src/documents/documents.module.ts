import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { ChatbotDocument } from './entities/document.entity';
import { DocumentsController } from './documents.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ChatbotDocument])],
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule { }