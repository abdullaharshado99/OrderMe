import { Repository, ILike, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ayah } from 'src/content/entities/ayah.entity';
import { Para } from '../../content/entities/para.entity';
import { Ruku } from '../../content/entities/ruku.entity';
import { Surah } from 'src/content/entities/surah.entity';
import { CreateRukuDto, UpdateRukuDto } from '../dto/rukus.dto';
import { CreateSurahDto, UpdateSurahDto } from '../dto/surahs.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateParaDto, UpdateParaDto, PaginationQueryDto } from '../dto/paras.dto';

@Injectable()
export class AdminContentService {
  constructor(
    @InjectRepository(Para) private readonly paraRepo: Repository<Para>,
    @InjectRepository(Surah) private readonly surahRepo: Repository<Surah>,
    @InjectRepository(Ruku) private readonly rukuRepo: Repository<Ruku>,
    @InjectRepository(Ayah) private readonly ayahRepo: Repository<Ayah>,
  ) { }

  async listParas(query: PaginationQueryDto) {
    const { page = 1, limit = 20, search } = query;
    const where = search
      ? [{ title: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }]
      : {};
    const [items, total] = await this.paraRepo.findAndCount({
      where,
      relations: ['rukus', 'ayahs', 'surahs'],
      skip: (page - 1) * limit,
      take: limit,
      order: { number: 'ASC' },
    });
    return { items, total, page, limit };
  }

  async createPara(dto: CreateParaDto) {
    const para = this.paraRepo.create({
      number: dto.paraNumber,
      title: dto.title,
      numberOfSurahs: dto.numberOfSurahs,
      numberOfAyahs: dto.numberOfAyahs,
    });
    return this.paraRepo.save(para);
  }

  async updatePara(id: number, dto: UpdateParaDto) {
    const para = await this.paraRepo.findOne({ where: { id } });
    if (!para) throw new NotFoundException('Para not found');
    if (dto.paraNumber != null) para.number = dto.paraNumber;
    if (dto.title != null) para.title = dto.title;
    return this.paraRepo.save(para);
  }

  async deletePara(id: number) {
    const res = await this.paraRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Para not found');
    return { success: true };
  }

  async listSurahs(query: PaginationQueryDto) {
    const { page = 1, limit = 20, search } = query;
    const where = search
      ? [{ title: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }]
      : {};
    const [items, total] = await this.surahRepo.findAndCount({
      where,
      relations: ['rukus', 'ayahs', 'paras'],
      skip: (page - 1) * limit,
      take: limit,
      order: { number: 'ASC' },
    });
    return { items, total, page, limit };
  }

  async createSurah(dto: CreateSurahDto) {
    const surah = this.surahRepo.create({
      number: dto.surahNumber,
      name: dto.name,
      englishName: dto.englishName,
      startingPage: dto.startingPage,
      endingPage: dto.endingPage,
      englishNameTranslation: dto.englishNameTranslation,
      revelationType: dto.revelationType,
      numberOfAyahs: dto.numberOfAyahs,
      revelationOrder: dto.revelationOrder,
    });
    if (dto.paraIds && dto.paraIds.length > 0) {
      const paras = await this.paraRepo.findByIds(dto.paraIds);
      if (paras.length !== dto.paraIds.length) {
        throw new NotFoundException('One or more Paras not found');
      }
      surah.paras = paras;
    }
    return this.surahRepo.save(surah);
  }

  async updateSurah(id: number, dto: UpdateSurahDto) {
    const surah = await this.surahRepo.findOne({ where: { id }, relations: ['paras'] });
    if (!surah) throw new NotFoundException('Surah not found');
    if (dto.surahNumber != null) surah.number = dto.surahNumber;
    if (dto.name != null) surah.name = dto.name;
    if (dto.englishName != null) surah.englishName = dto.englishName;
    if (dto.startingPage != null) surah.startingPage = dto.startingPage;
    if (dto.endingPage != null) surah.endingPage = dto.endingPage;
    if (dto.englishNameTranslation != null)
      surah.englishNameTranslation = dto.englishNameTranslation;
    if (dto.revelationType != null) surah.revelationType = dto.revelationType;
    if (dto.numberOfAyahs != null) surah.numberOfAyahs = dto.numberOfAyahs;
    if (dto.revelationOrder != null) surah.revelationOrder = dto.revelationOrder;
    if (dto.paraIds) {
      const paras = await this.paraRepo.findByIds(dto.paraIds);
      if (paras.length !== dto.paraIds.length) {
        throw new NotFoundException('One or more Paras not found');
      }
      surah.paras = paras;
    }
    return this.surahRepo.save(surah);
  }

  async deleteSurah(id: number) {
    const res = await this.surahRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Surah not found');
    return { success: true };
  }

  async listRukus(paraId?: number) {
    return this.rukuRepo.find({
      where: paraId ? { para: { id: paraId } } : {},
      relations: ['para', 'ayahs'],
      order: { number: 'ASC' },
    });
  }

  async createRuku(dto: CreateRukuDto) {
    const para = await this.paraRepo.findOne({ where: { id: dto.paraId } });
    if (!para) throw new NotFoundException('Para not found');
    const ruku = this.rukuRepo.create({
      number: dto.rukuNumber,
      title: dto.title,
      para,
    });

    if (dto.surahId != null) {
      const surah = await this.surahRepo.findOne({ where: { id: dto.surahId } });
      if (!surah) throw new NotFoundException('Surah not found');
      ruku.surah = surah;
    };

    if (dto.ayahNumbers && dto.ayahNumbers.length > 0) {
      if (!dto.surahId) {
        throw new BadRequestException('surahId is required when using ayahNumbers');
      }

      const ayahs = await this.ayahRepo.find({
        where: {
          surah: { id: dto.surahId },
          ayahNumber: In(dto.ayahNumbers),
        },
      });

      if (ayahs.length !== dto.ayahNumbers.length) {
        const foundNumbers = ayahs.map(a => a.ayahNumber);
        const missingNumbers = dto.ayahNumbers.filter(num => !foundNumbers.includes(num));
        throw new NotFoundException(`Ayahs not found for numbers: ${missingNumbers.join(', ')}`);
      }

      ruku.ayahs = ayahs;
    }

    else if (dto.ayahReferences && dto.ayahReferences.length > 0) {
      const ayahs: Ayah[] = [];

      for (const ref of dto.ayahReferences) {
        const ayah = await this.ayahRepo.findOne({
          where: {
            surah: { number: ref.surahNumber },
            ayahNumber: ref.ayahNumber,
          },
          relations: ['surah'],
        });

        if (!ayah) {
          throw new NotFoundException(
            `Ayah not found: Surah ${ref.surahNumber}, Ayah ${ref.ayahNumber}`
          );
        }

        ayahs.push(ayah);
      }

      ruku.ayahs = ayahs;
    }
    return this.rukuRepo.save(ruku);
  }

  async updateRuku(id: number, dto: UpdateRukuDto) {
    const ruku = await this.rukuRepo.findOne({ where: { id }, relations: ['para'] });
    if (!ruku) throw new NotFoundException('Ruku not found');
    if (dto.rukuNumber != null) ruku.number = dto.rukuNumber;
    if (dto.title != null) ruku.title = dto.title;
    if (dto.paraId && dto.paraId !== ruku.para.id) {
      const para = await this.paraRepo.findOne({ where: { id: dto.paraId } });
      if (!para) throw new NotFoundException('Para not found');
      ruku.para = para;
    }
    if (dto.surahId != null) {
      const surah = await this.surahRepo.findOne({ where: { id: dto.surahId } });
      if (!surah) throw new NotFoundException('Surah not found');
      ruku.surah = surah;
    }

    if (dto.ayahNumbers && dto.ayahNumbers.length > 0) {
      if (!dto.surahId) {
        throw new BadRequestException('surahId is required when using ayahNumbers');
      }

      const ayahs = await this.ayahRepo.find({
        where: {
          surah: { id: dto.surahId },
          ayahNumber: In(dto.ayahNumbers),
        },
      });

      if (ayahs.length !== dto.ayahNumbers.length) {
        const foundNumbers = ayahs.map(a => a.ayahNumber);
        const missingNumbers = dto.ayahNumbers.filter(num => !foundNumbers.includes(num));
        throw new NotFoundException(`Ayahs not found for numbers: ${missingNumbers.join(', ')}`);
      }

      ruku.ayahs = ayahs;
    }
    else if (dto.ayahReferences && dto.ayahReferences.length > 0) {
      const ayahs: Ayah[] = [];

      for (const ref of dto.ayahReferences) {
        const ayah = await this.ayahRepo.findOne({
          where: {
            surah: { number: ref.surahNumber },
            ayahNumber: ref.ayahNumber,
          },
          relations: ['surah'],
        });

        if (!ayah) {
          throw new NotFoundException(
            `Ayah not found: Surah ${ref.surahNumber}, Ayah ${ref.ayahNumber}`
          );
        }

        ayahs.push(ayah);
      }

      ruku.ayahs = ayahs;
    }
    return this.rukuRepo.save(ruku);
  }

  async deleteRuku(id: number) {
    const res = await this.rukuRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Ruku not found');
    return { success: true };
  }
}