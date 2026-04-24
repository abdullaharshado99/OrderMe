import { diskStorage } from 'multer';
import type { Express } from 'express';
import { Type } from 'class-transformer';
import { IsNull, Repository } from 'typeorm';
import { extname, join, resolve } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Ayah } from 'src/content/entities/ayah.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Ruku } from '../../content/entities/ruku.entity';
import { Para } from '../../content/entities/para.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Surah } from '../../content/entities/surah.entity';
import { RolesGuard } from '../../common/guards/roles.guard';
import { access, copyFile, rename, unlink } from 'fs/promises';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { removeUploadedFile } from '../utils/remove-uploaded-file';
import { VideoContent } from '../../content/entities/video-content.entity';
import { MEDIA_EXISTS_MESSAGE } from '../../common/types/media-replace-check';
import { IsInt, IsOptional, IsString, Matches, validateOrReject } from 'class-validator';
import { Controller, Post, Delete, Get, Put, Param, Body, Query, ParseIntPipe, UploadedFile, UseInterceptors, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';

class UploadMediaDto {
    @IsInt()
    @IsOptional()
    paraId?: number;

    @IsInt()
    @IsOptional()
    surahId?: number;

    uniqueId?: number;

    @IsInt()
    @IsOptional()
    rukuId?: number;

    @IsOptional()
    @IsInt()
    ayahId?: number;

    @IsString()
    type: 'video';

    @IsOptional()
    @IsInt()
    durationSeconds?: number;
}

class CommitChunkedVideoDto {
    @IsString()
    @Matches(/^final\/[^/]+$/, {
        message: 'relativeFinalPath must be final/<filename> with no extra path segments',
    })
    relativeFinalPath: string;

    @Type(() => Number)
    @IsInt()
    paraId: number;

    @Type(() => Number)
    @IsInt()
    surahId: number;

    @Type(() => Number)
    @IsInt()
    rukuId: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    ayahId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    durationSeconds?: number;
}

const MERGED_VIDEO_TITLE_UUID_PREFIX =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}-/;

function titleFromMergedRelativePath(relativeFinalPath: string): string {
    const base = relativeFinalPath.split('/').pop() ?? 'video';
    const lastDot = base.lastIndexOf('.');
    const stem = lastDot > 0 ? base.slice(0, lastDot) : base;
    const stripped = stem.replace(MERGED_VIDEO_TITLE_UUID_PREFIX, '').trim();
    return stripped || stem.trim() || 'video';
}

@ApiTags('admin-media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/media')
export class AdminMediaController {
    constructor(
        @InjectRepository(Ruku) private readonly rukuRepo: Repository<Ruku>,
        @InjectRepository(Ayah) private readonly ayahRepo: Repository<Ayah>,
        @InjectRepository(VideoContent) private readonly videoRepo: Repository<VideoContent>,
        @InjectRepository(Para) private readonly paraRepo: Repository<Para>,
        @InjectRepository(Surah) private readonly surahRepo: Repository<Surah>,
    ) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/media',
                filename: (_req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, unique + extname(file.originalname));
                },
            }),
        }),
    )
    async upload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const dto = new UploadMediaDto();
        dto.paraId = body.paraId ? parseInt(body.paraId) : undefined;
        dto.surahId = body.surahId ? parseInt(body.surahId) : undefined;
        dto.rukuId = parseInt(body.rukuId);
        dto.ayahId = body.ayahId ? parseInt(body.ayahId) : undefined;
        dto.type = body.type as 'video';
        dto.durationSeconds = body.durationSeconds ? parseInt(body.durationSeconds) : undefined;
        dto.uniqueId = parseInt(`${dto.paraId}${dto.surahId}${dto.rukuId}`, 10);
        await validateOrReject(dto);
        if (dto.paraId == null || dto.surahId == null || dto.rukuId == null) {
            throw new BadRequestException('paraId, surahId and rukuId are required to compute uniqueId');
        }

        const [para, surah] = await Promise.all([
            this.paraRepo.findOne({ where: { number: dto.paraId } }),
            this.surahRepo.findOne({ where: { number: dto.surahId } }),
        ]);

        if (!para) {
            throw new BadRequestException(`Para (juz) not found: ${dto.paraId}`);
        }
        if (!surah) {
            throw new BadRequestException(`Surah not found: ${dto.surahId}`);
        }

        const ruku = await this.rukuRepo.findOne({
            where: {
                id: dto.rukuId,
                surah: { id: surah.id } as any,
            },
            relations: ['para', 'surah'],
        });
        if (!ruku) {
            throw new BadRequestException('Ruku not found for given para/surah/ruku combination');
        }
        let ayah: Ayah | null = null;

        if (dto.ayahId) {
            ayah = await this.ayahRepo.findOne({
                where: { id: dto.ayahId },
                relations: ['ruku']
            });

            if (!ayah) {
                throw new BadRequestException('Ayah not found');
            }

            if (ayah.ruku?.id !== ruku.id) {
                throw new BadRequestException('Ayah does not belong to the specified ruku');
            }
        }

        const url = `/uploads/media/${file.filename}`;
        const autoTitle = file.originalname.split('.')[0];

        const commonFields: any = {
            ruku: ruku,
            ayah: ayah || undefined,
            title: autoTitle,
            durationSeconds: dto.durationSeconds,
            uniqueId: dto.uniqueId,
            surahId: dto.surahId,
            paraId: dto.paraId,
        };

        if (dto.type === 'video') {
            const dupWhere = {
                paraId: dto.paraId,
                surahId: dto.surahId,
                uniqueId: dto.uniqueId,
                ruku: { id: ruku.id },
                ...(dto.ayahId
                    ? { ayah: { id: dto.ayahId } }
                    : { ayah: IsNull() }),
            } as const;
            const existingVideo = await this.videoRepo.findOne({ where: dupWhere as any });
            if (existingVideo) {
                await removeUploadedFile('uploads/media', file);
                return {
                    exists: true,
                    message: MEDIA_EXISTS_MESSAGE,
                    existingId: existingVideo.id,
                };
            }

            const entity = this.videoRepo.create({
                ...commonFields,
                videoUrl: url,
            });
            const saved = await this.videoRepo.save(entity);
            return {
                exists: false,
                success: true,
                data: saved,
                message: 'Video media uploaded successfully',
            };
        }

        throw new BadRequestException('Unsupported media type: ' + dto.type);
    }

    @Post('commit-chunked-video')
    async commitChunkedVideo(@Body() raw: CommitChunkedVideoDto) {
        const body = Object.assign(new CommitChunkedVideoDto(), raw);
        await validateOrReject(body);

        if (body.relativeFinalPath.includes('..')) {
            throw new BadRequestException('Invalid relativeFinalPath');
        }
        const uploadsRoot = resolve(process.cwd(), 'uploads');
        const finalRoot = resolve(uploadsRoot, 'final');
        const srcAbsolute = resolve(uploadsRoot, ...body.relativeFinalPath.split('/'));
        if (!srcAbsolute.startsWith(finalRoot)) {
            throw new BadRequestException('Invalid final file path');
        }
        try {
            await access(srcAbsolute);
        } catch {
            throw new BadRequestException('Merged file not found at ' + body.relativeFinalPath);
        }

        const dto = new UploadMediaDto();
        dto.paraId = body.paraId;
        dto.surahId = body.surahId;
        dto.rukuId = body.rukuId;
        dto.ayahId = body.ayahId;
        dto.type = 'video';
        dto.durationSeconds = body.durationSeconds;
        dto.uniqueId = parseInt(`${dto.paraId}${dto.surahId}${dto.rukuId}`, 10);
        await validateOrReject(dto);
        if (dto.paraId == null || dto.surahId == null || dto.rukuId == null) {
            throw new BadRequestException('paraId, surahId and rukuId are required');
        }

        const [para, surah] = await Promise.all([
            this.paraRepo.findOne({ where: { number: dto.paraId } }),
            this.surahRepo.findOne({ where: { number: dto.surahId } }),
        ]);
        if (!para) {
            throw new BadRequestException(`Para (juz) not found: ${dto.paraId}`);
        }
        if (!surah) {
            throw new BadRequestException(`Surah not found: ${dto.surahId}`);
        }
        const ruku = await this.rukuRepo.findOne({
            where: {
                id: dto.rukuId,
                surah: { id: surah.id } as any,
            },
            relations: ['para', 'surah'],
        });
        if (!ruku) {
            throw new BadRequestException('Ruku not found for given para/surah/ruku combination');
        }
        let ayah: Ayah | null = null;
        if (dto.ayahId) {
            ayah = await this.ayahRepo.findOne({
                where: { id: dto.ayahId },
                relations: ['ruku'],
            });
            if (!ayah) {
                throw new BadRequestException('Ayah not found');
            }
            if (ayah.ruku?.id !== ruku.id) {
                throw new BadRequestException('Ayah does not belong to the specified ruku');
            }
        }

        const mediaDir = join(process.cwd(), 'uploads', 'media');
        const destFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(srcAbsolute) || extname(body.relativeFinalPath) || '.mp4'}`;
        const destAbsolute = join(mediaDir, destFilename);
        try {
            await rename(srcAbsolute, destAbsolute);
        } catch (e: any) {
            if (e?.code === 'EXDEV') {
                await copyFile(srcAbsolute, destAbsolute);
                await unlink(srcAbsolute);
            } else {
                throw e;
            }
        }

        const url = `/uploads/media/${destFilename}`;
        const autoTitle = titleFromMergedRelativePath(body.relativeFinalPath);

        const commonFields: any = {
            ruku: ruku,
            ayah: ayah || undefined,
            title: autoTitle,
            durationSeconds: dto.durationSeconds,
            uniqueId: dto.uniqueId,
            surahId: dto.surahId,
            paraId: dto.paraId,
        };

        const dupWhere = {
            paraId: dto.paraId,
            surahId: dto.surahId,
            uniqueId: dto.uniqueId,
            ruku: { id: ruku.id },
            ...(dto.ayahId ? { ayah: { id: dto.ayahId } } : { ayah: IsNull() }),
        } as const;
        const existingVideo = await this.videoRepo.findOne({ where: dupWhere as any });
        if (existingVideo) {
            await unlink(destAbsolute).catch(() => undefined);
            return {
                exists: true,
                message: MEDIA_EXISTS_MESSAGE,
                existingId: existingVideo.id,
            };
        }

        const entity = this.videoRepo.create({
            ...commonFields,
            videoUrl: url,
        });
        const saved = await this.videoRepo.save(entity);
        return {
            exists: false,
            success: true,
            data: saved,
            message: 'Video media uploaded successfully',
        };
    }

    @Put('video/:id')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/media',
                filename: (_req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, unique + extname(file.originalname));
                },
            }),
        }),
    )
    async replaceVideo(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const row = await this.videoRepo.findOne({
            where: { id },
            relations: ['ruku', 'ayah'],
        });
        if (!row) {
            await removeUploadedFile('uploads/media', file);
            throw new NotFoundException('Video not found');
        }

        const dto = new UploadMediaDto();
        dto.paraId = body.paraId ? parseInt(body.paraId) : undefined;
        dto.surahId = body.surahId ? parseInt(body.surahId) : undefined;
        dto.rukuId = parseInt(body.rukuId);
        dto.ayahId = body.ayahId ? parseInt(body.ayahId) : undefined;
        dto.type = 'video';
        dto.durationSeconds = body.durationSeconds ? parseInt(body.durationSeconds) : undefined;
        dto.uniqueId = parseInt(`${dto.paraId}${dto.surahId}${dto.rukuId}`, 10);
        await validateOrReject(dto);
        if (dto.paraId == null || dto.surahId == null || dto.rukuId == null || dto.rukuId !== row.ruku?.id) {
            await removeUploadedFile('uploads/media', file);
            throw new BadRequestException('paraId, surahId and rukuId must match this video’s ruku');
        }
        if (dto.ayahId) {
            if (row.ayah?.id !== dto.ayahId) {
                await removeUploadedFile('uploads/media', file);
                throw new BadRequestException('ayahId does not match this video record');
            }
        } else if (row.ayah != null) {
            await removeUploadedFile('uploads/media', file);
            throw new BadRequestException('This video is ayah-scoped; ayahId is required');
        }

        row.title = file.originalname.split('.')[0];
        row.videoUrl = `/uploads/media/${file.filename}`;
        row.durationSeconds = dto.durationSeconds;
        row.paraId = dto.paraId;
        row.surahId = dto.surahId;
        row.uniqueId = dto.uniqueId;
        const updated = await this.videoRepo.save(row);
        return {
            exists: false,
            success: true,
            data: updated,
            message: 'Video media updated successfully',
        };
    }

    @Get()
    async list(
        @Query('paraId') paraId?: string,
        @Query('uniqueId') uniqueId?: string,
        @Query('surahId') surahId?: string,
        @Query('rukuId') rukuId?: string,
    ) {
        const where: any = {};
        if (rukuId) {
            where.ruku = { id: +rukuId };
        }
        if (paraId) {
            where.paraId = +paraId;
        }
        if (surahId) {
            where.surahId = +surahId;
        }
        if (uniqueId) {
            where.uniqueId = +uniqueId;
        }

        return Promise.all([
            this.videoRepo.find({ where, relations: ['ruku', 'ruku.para'] }),
        ]).then(([videos]) => ({
            videos,
        }));
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Query('type') type: 'video') {
        if (type === 'video') {
            await this.videoRepo.delete(id);
        } else {
            throw new BadRequestException('Unsupported media type: ' + type);
        }
        return { success: true };
    }
}