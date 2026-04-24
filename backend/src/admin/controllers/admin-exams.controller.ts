import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Para } from '../../content/entities/para.entity';
import { Surah } from 'src/content/entities/surah.entity';
import { RolesGuard } from '../../common/guards/roles.guard';
import { stripNullBytes } from '../../common/strip-null-bytes';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateExamDto, UpdateExamDto } from '../dto/exams.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Exam } from '../../assessments/exams/entities/exam.entity';
import { ExamQuestion } from '../../assessments/exams/entities/exam-question.entity';
import { Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Body, Query, UseGuards } from '@nestjs/common';

@ApiTags('admin-exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/exams')
export class AdminExamsController {
  constructor(
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
    @InjectRepository(ExamQuestion) private readonly questionRepo: Repository<ExamQuestion>,
    @InjectRepository(Para) private readonly paraRepo: Repository<Para>,
    @InjectRepository(Surah) private readonly surahRepo: Repository<Surah>,
  ) { }

  @Get()
  list(@Query('paraId') paraId?: string) {
    return this.examRepo.find({
      where: paraId ? { para: { id: +paraId } } : {},
      relations: ['para', 'questions'],
      order: { id: 'DESC' },
    });
  }

  @Post()
  async create(@Body() dto: CreateExamDto) {
    const para = await this.paraRepo.findOne({ where: { id: dto.paraId } });
    if (!para) throw new Error('Para not found');

    const exam = this.examRepo.create({
      para,
      title: stripNullBytes(dto.title),
      passPercentage: dto.passPercentage,
      durationMinutes: dto.durationMinutes ?? null,
      isActive: dto.isActive ?? true,
      questions: dto.questions.map((q) => {
        return this.questionRepo.create({
          questionText: stripNullBytes(q.questionText),
          options: q.options.map((o) => stripNullBytes(o)),
          correctAnswer: stripNullBytes(q.correctAnswer),
          sectionName: stripNullBytes(q.sectionName) as typeof q.sectionName,
          points: typeof q.points === 'number' ? q.points : 1,
          order: typeof q.order === 'number' ? q.order : 0,
        });
      }),
    });
    return this.examRepo.save(exam);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExamDto) {
    const exam = await this.examRepo.findOne({ where: { id }, relations: ['para', 'questions'] });
    if (!exam) throw new Error('Exam not found');

    if (dto.paraId && dto.paraId !== exam.para.id) {
      const para = await this.paraRepo.findOne({ where: { id: dto.paraId } });
      if (!para) throw new Error('Para not found');
      exam.para = para;
    }

    if (dto.title !== undefined) exam.title = stripNullBytes(dto.title);
    if (dto.passPercentage !== undefined) exam.passPercentage = dto.passPercentage;
    if (dto.durationMinutes !== undefined) exam.durationMinutes = dto.durationMinutes;
    if (dto.isActive !== undefined) exam.isActive = dto.isActive;

    if (dto.questions) {
      const existingRows = await this.questionRepo.find({
        where: { exam: { id: exam.id } },
        order: { order: 'ASC' },
      });
      const existingIds = new Set(existingRows.map((r) => r.id));
      const idsInDto = new Set(
        dto.questions.map((q) => q.id).filter((x): x is number => typeof x === 'number'),
      );

      const toRemoveIds = existingRows.filter((r) => !idsInDto.has(r.id)).map((r) => r.id);
      if (toRemoveIds.length) {
        await this.questionRepo.delete(toRemoveIds);
      }

      for (let i = 0; i < dto.questions.length; i++) {
        const q = dto.questions[i];
        const order = typeof q.order === 'number' ? q.order : i + 1;
        const fields = {
          questionText: stripNullBytes(q.questionText),
          options: q.options.map((o) => stripNullBytes(o)),
          correctAnswer: stripNullBytes(q.correctAnswer),
          sectionName: stripNullBytes(q.sectionName) as typeof q.sectionName,
          points: typeof q.points === 'number' ? q.points : 1,
          order,
        };

        if (typeof q.id === 'number' && existingIds.has(q.id)) {
          await this.questionRepo.update({ id: q.id, exam: { id: exam.id } }, fields);
        } else {
          await this.questionRepo.save(this.questionRepo.create({ exam, ...fields }));
        }
      }

      exam.questions = await this.questionRepo.find({
        where: { exam: { id: exam.id } },
        order: { order: 'ASC' },
      });
    }

    return this.examRepo.save(exam);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.examRepo.delete(id);
    return { success: true };
  }
}