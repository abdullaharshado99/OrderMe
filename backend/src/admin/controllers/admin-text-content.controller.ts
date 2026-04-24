import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ayah } from 'src/content/entities/ayah.entity';
import { Ruku } from 'src/content/entities/ruku.entity';
import { Para } from 'src/content/entities/para.entity';
import { Surah } from 'src/content/entities/surah.entity';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { TextContent } from 'src/content/entities/text-content.entity';
import { MEDIA_EXISTS_MESSAGE } from '../../common/types/media-replace-check';
import { Controller, Post, Get, Param, Body, Delete, Put, BadRequestException, NotFoundException, ParseIntPipe } from '@nestjs/common';

@ApiTags('admin-text-content')
@Controller('admin/text-content')
export class AdminTextContentController {
    constructor(
        @InjectRepository(TextContent) private readonly textContentRepo: Repository<TextContent>,
        @InjectRepository(Ayah) private readonly ayahRepo: Repository<Ayah>,
        @InjectRepository(Surah) private readonly surahRepo: Repository<Surah>,
        @InjectRepository(Para) private readonly paraRepo: Repository<Para>,
        @InjectRepository(Ruku) private readonly rukuRepo: Repository<Ruku>,
    ) { }

    @Post('create')
    @ApiOperation({ summary: 'Create text content (tafseer + translation) for an Ayah' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                ayahId: { type: 'number', description: 'ID of the Ayah' },
                surahId: { type: 'number', description: 'Surah ID' },
                paraId: { type: 'number', description: 'Para ID' },
                rukuId: { type: 'number', description: 'Ruku ID' },
                ayahTafseer: { type: 'string', description: 'Tafseer/interpretation of the Ayah' },
                ayahEnglishTranslation: { type: 'string', description: 'English translation of the Ayah' },
            },
            required: ['ayahId', 'ayahTafseer', 'ayahEnglishTranslation'],
        },
    })
    async createTextContent(@Body() body: any) {
        if (!body.ayahId) {
            throw new BadRequestException('ayahId is required');
        }
        if (!body.ayahTafseer || body.ayahTafseer.trim() === '') {
            throw new BadRequestException('ayahTafseer is required');
        }
        if (!body.ayahEnglishTranslation || body.ayahEnglishTranslation.trim() === '') {
            throw new BadRequestException('ayahEnglishTranslation is required');
        }

        const ayahId = parseInt(body.ayahId);
        const ayah = await this.ayahRepo.findOne({
            where: { id: ayahId },
            relations: ['ruku', 'surah', 'para'],
        });

        if (!ayah) {
            throw new BadRequestException(`Ayah with id ${ayahId} not found`);
        }

        const existingText = await this.textContentRepo.findOne({
            where: { ayah: { id: ayahId } },
        });

        if (existingText) {
            return {
                exists: true,
                message: MEDIA_EXISTS_MESSAGE,
                existingId: existingText.id,
            };
        }

        const surahId = body.surahId ? parseInt(body.surahId) : ayah.surah?.id;
        const paraId = body.paraId ? parseInt(body.paraId) : ayah.para?.id;
        const rukuId = body.rukuId ? parseInt(body.rukuId) : ayah.ruku?.id;

        const textContent = this.textContentRepo.create({
            ayah,
            surahId: surahId || ayah.surah?.id,
            paraId: paraId || ayah.para?.id,
            rukuId: rukuId || ayah.ruku?.id,
            ayahTafseer: body.ayahTafseer.trim(),
            ayahEnglishTranslation: body.ayahEnglishTranslation.trim(),
        });

        const saved = await this.textContentRepo.save(textContent);

        return {
            exists: false,
            success: true,
            data: saved,
            message: 'Text content created successfully',
        };
    }

    @Get('by-ayah/:ayahId')
    @ApiOperation({ summary: 'Get text content by Ayah ID' })
    async getByAyah(@Param('ayahId', ParseIntPipe) ayahId: number) {
        const textContent = await this.textContentRepo.findOne({
            where: { ayah: { id: ayahId } },
            relations: ['ayah'],
        });

        if (!textContent) {
            return {
                success: true,
                data: null,
                message: 'No text content found for this Ayah',
            };
        }

        return {
            success: true,
            data: textContent,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get text content by ID' })
    async getById(@Param('id', ParseIntPipe) id: number) {
        const textContent = await this.textContentRepo.findOne({
            where: { id },
            relations: ['ayah'],
        });

        if (!textContent) {
            throw new NotFoundException('Text content not found');
        }

        return {
            success: true,
            data: textContent,
        };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update text content' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                ayahTafseer: { type: 'string', description: 'Updated tafseer' },
                ayahEnglishTranslation: { type: 'string', description: 'Updated English translation' },
            },
        },
    })
    async updateTextContent(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        let textContent = await this.textContentRepo.findOne({
            where: { id },
            relations: ['ayah'],
        });

        if (!textContent) {
            throw new NotFoundException('Text content not found');
        }

        if (body.ayahTafseer !== undefined && body.ayahTafseer.trim() !== '') {
            textContent.ayahTafseer = body.ayahTafseer.trim();
        }
        if (body.ayahEnglishTranslation !== undefined && body.ayahEnglishTranslation.trim() !== '') {
            textContent.ayahEnglishTranslation = body.ayahEnglishTranslation.trim();
        }

        const updated = await this.textContentRepo.save(textContent);

        return {
            success: true,
            data: updated,
            message: 'Text content updated successfully',
        };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete text content' })
    async deleteTextContent(@Param('id', ParseIntPipe) id: number) {
        const textContent = await this.textContentRepo.findOne({
            where: { id },
        });

        if (!textContent) {
            throw new NotFoundException('Text content not found');
        }

        await this.textContentRepo.delete(id);

        return {
            success: true,
            message: 'Text content deleted successfully',
        };
    }
}