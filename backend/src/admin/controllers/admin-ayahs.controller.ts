import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ayah } from '../../content/entities/ayah.entity';
import { Para } from '../../content/entities/para.entity';
import { Ruku } from '../../content/entities/ruku.entity';
import { Surah } from 'src/content/entities/surah.entity';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpsertAyahDto, BulkAyahUploadDto } from '../dto/ayahs.dto';
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('admin-ayahs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/ayahs')
export class AdminAyahsController {
  constructor(
    @InjectRepository(Ayah) private readonly ayahRepo: Repository<Ayah>,
    @InjectRepository(Para) private readonly paraRepo: Repository<Para>,
    @InjectRepository(Surah) private readonly surahRepo: Repository<Surah>,
    @InjectRepository(Ruku) private readonly rukuRepo: Repository<Ruku>,
  ) { }

  @Get()
  @ApiOperation({ summary: 'List ayahs, optionally by para or ruku' })
  @ApiResponse({ status: 200, description: 'List of ayahs' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  list(@Query('paraId') paraId?: string, @Query('rukuId') rukuId?: string, @Query('search') search?: string) {
    const qb = this.ayahRepo
      .createQueryBuilder('ayah')
      .leftJoinAndSelect('ayah.para', 'para')
      .leftJoinAndSelect('ayah.ruku', 'ruku')
      .leftJoinAndSelect('ayah.surah', 'surah');

    if (paraId) qb.andWhere('para.id = :paraId', { paraId: +paraId });
    if (rukuId) qb.andWhere('ruku.id = :rukuId', { rukuId: +rukuId });
    if (search) {
      qb.andWhere(
        '(ayah.arabicText ILIKE :search OR ayah.translationEn ILIKE :search OR ayah.translationUr ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return qb.orderBy('ayah.ayahNumber', 'ASC').getMany();
  }

  @Post()
  upsert(@Body() dto: UpsertAyahDto) {
    return this.ayahRepo.save({
      para: { id: dto.paraId } as Para,
      ruku: { id: dto.rukuId } as Ruku,
      surah: dto.surahId ? ({ id: dto.surahId } as Surah) : undefined,
      ayahNumber: dto.ayahNumber,
      arabicText: dto.arabicText,
      numberInSurah: dto.numberInSurah,
      juz: dto.juz,
      manzil: dto.manzil,
      page: dto.page,
      hizbQuarter: dto.hizbQuarter,
      sajda: dto.sajda,
    });
  }

  @Post('bulk')
  bulk(@Body() dto: BulkAyahUploadDto) {
    const entities = dto.items.map((item) =>
      this.ayahRepo.create({
        para: { id: item.paraId } as Para,
        ruku: { id: item.rukuId } as Ruku,
        surah: item.surahId ? ({ id: item.surahId } as Surah) : undefined,
        ayahNumber: item.ayahNumber,
        arabicText: item.arabicText,
        numberInSurah: item.numberInSurah,
        juz: item.juz,
        manzil: item.manzil,
        page: item.page,
        hizbQuarter: item.hizbQuarter,
        sajda: item.sajda,
      }),
    );
    return this.ayahRepo.save(entities);
  }
}

