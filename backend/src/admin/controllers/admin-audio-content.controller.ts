import { extname } from 'path';
import { diskStorage } from 'multer';
import type { Express } from 'express';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ayah } from '../../content/entities/ayah.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { removeUploadedFile } from '../utils/remove-uploaded-file';
import { AudioContent } from '../../content/entities/audio-content.entity';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { MEDIA_EXISTS_MESSAGE, MediaUpsertCheckResult } from '../../common/types/media-replace-check';
import { Controller, Get, Param, Body, Post, Put, UploadedFile, UseGuards, UseInterceptors, Query, ParseIntPipe, BadRequestException, NotFoundException } from '@nestjs/common';

@ApiTags('admin-audio-content')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/audio-content')
export class AdminAudioContentController {
  constructor(
    @InjectRepository(AudioContent) private readonly audioRepo: Repository<AudioContent>,
    @InjectRepository(Ayah) private readonly ayahRepo: Repository<Ayah>,
  ) { }

  @Get()
  @ApiOperation({ summary: 'List audio content (optionally by ayahId)' })
  async list(@Query('ayahId') ayahId?: string) {
    if (ayahId) {
      return this.audioRepo.find({
        where: { ayah: { id: +ayahId } },
        relations: ['ayah', 'ruku'],
      });
    }
    return this.audioRepo.find({ relations: ['ayah', 'ruku'] });
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        ayahId: { type: 'number' },
        type: { type: 'string', enum: ['audio'] },
        audioType: { type: 'string', enum: ['arabic', 'urdu', 'tafseer'] },
        durationSeconds: { type: 'number' },
        paraId: { type: 'number' },
        surahId: { type: 'number' },
        rukuId: { type: 'number' },
      },
      required: ['file', 'ayahId', 'type', 'audioType'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/audio-content',
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: any): Promise<MediaUpsertCheckResult<AudioContent>> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!body.ayahId) {
      await removeUploadedFile('uploads/audio-content', file);
      throw new BadRequestException('ayahId is required');
    }

    const ayah = await this.ayahRepo.findOne({
      where: { id: parseInt(body.ayahId, 10) },
      relations: ['para', 'surah', 'ruku'],
    });
    if (!ayah) {
      await removeUploadedFile('uploads/audio-content', file);
      throw new BadRequestException(`Ayah with id ${body.ayahId} not found`);
    }

    if (!body.type || !['audio'].includes(body.type)) {
      await removeUploadedFile('uploads/audio-content', file);
      throw new BadRequestException('type must be "audio"');
    }

    if (body.audioType && !['arabic', 'urdu', 'tafseer'].includes(body.audioType)) {
      await removeUploadedFile('uploads/audio-content', file);
      throw new BadRequestException('audioType must be either "arabic" or "urdu" or "tafseer"');
    }

    const audioTypeVal = body.audioType as string | undefined;
    const existingMedia = await this.audioRepo.findOne({
      where: {
        ayah: { id: ayah.id },
        ...(audioTypeVal != null && audioTypeVal !== ''
          ? { audioType: audioTypeVal as 'arabic' | 'urdu' | 'tafseer' }
          : { audioType: IsNull() }),
      },
      relations: ['ayah'],
    });

    if (existingMedia) {
      await removeUploadedFile('uploads/audio-content', file);
      return {
        exists: true,
        message: MEDIA_EXISTS_MESSAGE,
        existingId: existingMedia.id,
      };
    }

    const url = `/uploads/audio-content/${file.filename}`;
    const autoTitle = file.originalname.split('.')[0];

    const durationSeconds =
      body.durationSeconds != null ? parseInt(body.durationSeconds, 10) : undefined;

    const audioEntity = this.audioRepo.create({
      ayah,
      ruku: ayah.ruku,
      title: autoTitle,
      audioUrl: url,
      audioType: audioTypeVal as 'arabic' | 'urdu' | 'tafseer' | undefined,
      durationSeconds,
      surahId: body.surahId ? parseInt(body.surahId, 10) : ayah.surahId,
      paraId: body.paraId ? parseInt(body.paraId, 10) : ayah.paraId,
    });

    const saved = await this.audioRepo.save(audioEntity);
    return {
      exists: false,
      success: true,
      data: saved,
      message: 'Audio uploaded successfully',
    };
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/audio-content',
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<MediaUpsertCheckResult<AudioContent>> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const row = await this.audioRepo.findOne({
      where: { id },
      relations: ['ayah', 'ruku'],
    });
    if (!row) {
      await removeUploadedFile('uploads/audio-content', file);
      throw new NotFoundException('Audio not found');
    }

    const ayahIdBody = body.ayahId ? parseInt(body.ayahId, 10) : undefined;
    if (ayahIdBody && row.ayah?.id && ayahIdBody !== row.ayah.id) {
      await removeUploadedFile('uploads/audio-content', file);
      throw new BadRequestException('ayahId does not match this record');
    }

    const url = `/uploads/audio-content/${file.filename}`;
    const autoTitle = file.originalname.split('.')[0];

    row.title = autoTitle;
    row.audioUrl = url;

    if (body.durationSeconds != null && body.durationSeconds !== '') {
      row.durationSeconds = parseInt(body.durationSeconds, 10);
    }
    if (body.audioType && ['arabic', 'urdu', 'tafseer'].includes(body.audioType)) {
      row.audioType = body.audioType;
    }

    row.surahId = body.surahId ? parseInt(body.surahId, 10) : row.surahId;
    row.paraId = body.paraId ? parseInt(body.paraId, 10) : row.paraId;

    const saved = await this.audioRepo.save(row);

    return {
      exists: false,
      success: true,
      data: saved,
      message: 'Audio updated successfully',
    };
  }
}