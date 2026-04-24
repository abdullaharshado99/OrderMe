import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Ruku } from '../../content/entities/ruku.entity';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Quiz } from '../../assessments/quizzes/entities/quiz.entity';
import { CreateSimpleQuizDto, UpdateSimpleQuizDto } from '../dto/quizzes.dto';
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';

@ApiTags('admin-quizzes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/quizzes')
export class AdminQuizzesController {
    constructor(
        @InjectRepository(Quiz) private readonly quizRepo: Repository<Quiz>,
        @InjectRepository(Ruku) private readonly rukuRepo: Repository<Ruku>,
    ) { }

    @Get()
    list(@Query('rukuId') rukuId?: string) {
        return this.quizRepo.find({
            where: rukuId ? { rukuId: +rukuId } : {},
            relations: ['ruku'],
            order: { id: 'DESC' },
        });
    }

    private buildUniqueId(paraId: number, surahId: number, rukuId: number, seq: number): string {
        return `${paraId}${surahId}${rukuId}-${seq}`;
    }

    private async nextQuizSeqForRuku(rukuId: number): Promise<number> {
        const rows = await this.quizRepo.find({
            where: { rukuId },
            select: ['uniqueId'],
        });
        let maxSeq = 0;
        for (const row of rows) {
            const uid = row.uniqueId;
            if (!uid) continue;
            const dash = uid.lastIndexOf('-');
            if (dash < 0) continue;
            const n = parseInt(uid.slice(dash + 1), 10);
            if (Number.isFinite(n) && n > maxSeq) maxSeq = n;
        }
        return maxSeq + 1;
    }

    @Post()
    async create(@Body() dto: CreateSimpleQuizDto) {
        const ruku = await this.rukuRepo.findOne({ where: { id: dto.rukuId } });
        if (!ruku) throw new NotFoundException('Ruku not found');

        const paraId = dto.paraId ?? ruku.paraId ?? 0;
        const surahId = dto.surahId ?? ruku.surahId ?? 0;
        const seq = await this.nextQuizSeqForRuku(dto.rukuId);
        const uniqueId = this.buildUniqueId(paraId, surahId, dto.rukuId, seq);

        const quiz = this.quizRepo.create({
            ruku,
            rukuId: dto.rukuId,
            paraId,
            surahId,
            uniqueId,
            question: dto.question,
            options: dto.options,
            correctAnswer: dto.correctAnswer,
            explanation: dto.explanation,
            isActive: dto.isActive ?? true,
        });
        return this.quizRepo.save(quiz);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSimpleQuizDto) {
        const quiz = await this.quizRepo.findOne({ where: { id }, relations: ['ruku'] });
        if (!quiz) throw new NotFoundException('Quiz not found');

        if (dto.rukuId !== undefined && dto.rukuId !== quiz.rukuId) {
            const ruku = await this.rukuRepo.findOne({ where: { id: dto.rukuId } });
            if (!ruku) throw new NotFoundException('Ruku not found');
            quiz.ruku = ruku;
            quiz.rukuId = dto.rukuId;
        }
        if (dto.question !== undefined) quiz.question = dto.question;
        if (dto.options !== undefined) quiz.options = dto.options;
        if (dto.correctAnswer !== undefined) quiz.correctAnswer = dto.correctAnswer;
        if (dto.explanation !== undefined) quiz.explanation = dto.explanation;
        if (dto.isActive !== undefined) quiz.isActive = dto.isActive;

        return this.quizRepo.save(quiz);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const quiz = await this.quizRepo.findOne({ where: { id } });
        if (!quiz) throw new NotFoundException('Quiz not found');
        await this.quizRepo.delete(id);
        return { success: true };
    }
}