import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Para } from '../../content/entities/para.entity';
import { Ruku } from '../../content/entities/ruku.entity';
import { Ayah } from '../../content/entities/ayah.entity';
import { Exam } from '../../assessments/exams/entities/exam.entity';
import { RukuMedia } from '../../content/entities/ruku-media.entity';
import { Quiz } from '../../assessments/quizzes/entities/quiz.entity';
import { TextContent } from '../../content/entities/text-content.entity';
import { VideoContent } from '../../content/entities/video-content.entity';
import { AudioContent } from '../../content/entities/audio-content.entity';
import { UserProgress } from '../../progress/entities/user-progress.entity';
import { ExamAttempt } from '../../assessments/exams/entities/exam-attempt.entity';
import { QuizAttempt } from '../../assessments/quizzes/entities/quiz-attempt.entity';

type AdminRecentActivity = {
  id: string;
  type: 'media' | 'quiz' | 'exam';
  action: 'created' | 'updated';
  title: string;
  occurredAt: string;
};

@Injectable()
export class AdminAnalyticsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Para) private readonly paraRepo: Repository<Para>,
    @InjectRepository(Ruku) private readonly rukuRepo: Repository<Ruku>,
    @InjectRepository(Ayah) private readonly ayahRepo: Repository<Ayah>,
    @InjectRepository(UserProgress) private readonly progressRepo: Repository<UserProgress>,
    @InjectRepository(QuizAttempt) private readonly quizAttemptRepo: Repository<QuizAttempt>,
    @InjectRepository(ExamAttempt) private readonly examAttemptRepo: Repository<ExamAttempt>,
    @InjectRepository(VideoContent) private readonly videoRepo: Repository<VideoContent>,
    @InjectRepository(AudioContent) private readonly audioRepo: Repository<AudioContent>,
    @InjectRepository(TextContent) private readonly textRepo: Repository<TextContent>,
    @InjectRepository(RukuMedia) private readonly rukuMediaRepo: Repository<RukuMedia>,
    @InjectRepository(Quiz) private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
  ) { }

  private toAction(createdAt?: Date, updatedAt?: Date): 'created' | 'updated' {
    if (!createdAt || !updatedAt) return 'updated';
    return createdAt.getTime() === updatedAt.getTime() ? 'created' : 'updated';
  }

  private iso(d: Date | undefined | null) {
    return (d ?? new Date()).toISOString();
  }

  private async getRecentActivities(): Promise<AdminRecentActivity[]> {
    const [videos, audios, texts, rukuMedia, quizzes, exams] = await Promise.all([
      (async () => {
        try {
          return await this.videoRepo
            .createQueryBuilder('v')
            .select(['v.id', 'v.title', 'v.createdAt', 'v.updatedAt'])
            .orderBy('v.updatedAt', 'ASC')
            .limit(5)
            .getMany();
        } catch {
          return await this.videoRepo
            .createQueryBuilder('v')
            .select(['v.id', 'v.title'])
            .orderBy('v.id', 'ASC')
            .limit(5)
            .getMany();
        }
      })(),
      (async () => {
        try {
          return await this.audioRepo
            .createQueryBuilder('a')
            .select(['a.id', 'a.title', 'a.createdAt', 'a.updatedAt'])
            .orderBy('a.updatedAt', 'ASC')
            .limit(5)
            .getMany();
        } catch {
          return await this.audioRepo
            .createQueryBuilder('a')
            .select(['a.id', 'a.title'])
            .orderBy('a.id', 'ASC')
            .limit(5)
            .getMany();
        }
      })(),
      (async () => {
        try {
          return await this.textRepo
            .createQueryBuilder('t')
            .select(['t.id', 't.createdAt', 't.updatedAt'])
            .orderBy('t.updatedAt', 'ASC')
            .limit(5)
            .getMany();
        } catch {
          return await this.textRepo
            .createQueryBuilder('t')
            .select(['t.id'])
            .orderBy('t.id', 'ASC')
            .limit(5)
            .getMany();
        }
      })(),
      (async () => {
        try {
          return await this.rukuMediaRepo
            .createQueryBuilder('rm')
            .select(['rm.id', 'rm.rukuId', 'rm.createdAt', 'rm.updatedAt'])
            .orderBy('rm.updatedAt', 'ASC')
            .limit(5)
            .getMany();
        } catch {
          return await this.rukuMediaRepo
            .createQueryBuilder('rm')
            .select(['rm.id', 'rm.rukuId'])
            .orderBy('rm.id', 'ASC')
            .limit(5)
            .getMany();
        }
      })(),
      (async () => {
        try {
          return await this.quizRepo
            .createQueryBuilder('q')
            .select(['q.id', 'q.rukuId', 'q.createdAt', 'q.updatedAt'])
            .orderBy('q.updatedAt', 'ASC')
            .limit(5)
            .getMany();
        } catch {
          return await this.quizRepo
            .createQueryBuilder('q')
            .select(['q.id', 'q.rukuId'])
            .orderBy('q.id', 'ASC')
            .limit(5)
            .getMany();
        }
      })(),
      (async () => {
        try {
          return await this.examRepo
            .createQueryBuilder('e')
            .select(['e.id', 'e.title', 'e.createdAt', 'e.updatedAt'])
            .orderBy('e.updatedAt', 'ASC')
            .limit(5)
            .getMany();
        } catch {
          return await this.examRepo
            .createQueryBuilder('e')
            .select(['e.id', 'e.title'])
            .orderBy('e.id', 'ASC')
            .limit(5)
            .getMany();
        }
      })(),
    ]);

    const items: AdminRecentActivity[] = [];

    for (const v of videos) {
      items.push({
        id: `video:${v.id}`,
        type: 'media',
        action: this.toAction(v.createdAt, v.updatedAt),
        title: `Video ${this.toAction(v.createdAt, v.updatedAt) === 'created' ? 'uploaded' : 'updated'}: ${v.title}`,
        occurredAt: this.iso(v.updatedAt),
      });
    }
    for (const a of audios) {
      items.push({
        id: `audio:${a.id}`,
        type: 'media',
        action: this.toAction(a.createdAt, a.updatedAt),
        title: `Audio ${this.toAction(a.createdAt, a.updatedAt) === 'created' ? 'uploaded' : 'updated'}: ${a.title}`,
        occurredAt: this.iso(a.updatedAt),
      });
    }
    for (const t of texts) {
      items.push({
        id: `text:${t.id}`,
        type: 'media',
        action: this.toAction(t.createdAt, t.updatedAt),
        title: `Text ${this.toAction(t.createdAt, t.updatedAt) === 'created' ? 'added' : 'updated'} (TextContent #${t.id})`,
        occurredAt: this.iso(t.updatedAt),
      });
    }
    for (const rm of rukuMedia) {
      items.push({
        id: `rukuMedia:${rm.id}`,
        type: 'media',
        action: this.toAction(rm.createdAt, rm.updatedAt),
        title: `Ruku media ${this.toAction(rm.createdAt, rm.updatedAt) === 'created' ? 'added' : 'updated'} (Ruku #${rm.rukuId})`,
        occurredAt: this.iso(rm.updatedAt),
      });
    }
    for (const q of quizzes) {
      items.push({
        id: `quiz:${q.id}`,
        type: 'quiz',
        action: this.toAction(q.createdAt, q.updatedAt),
        title: `Quiz ${this.toAction(q.createdAt, q.updatedAt) === 'created' ? 'created' : 'updated'} (Ruku #${q.rukuId})`,
        occurredAt: this.iso(q.updatedAt),
      });
    }
    for (const e of exams as any[]) {
      items.push({
        id: `exam:${e.id}`,
        type: 'exam',
        action: this.toAction(e.createdAt, e.updatedAt),
        title: `Exam ${this.toAction(e.createdAt, e.updatedAt) === 'created' ? 'created' : 'updated'}: ${e.title}`,
        occurredAt: this.iso(e.updatedAt),
      });
    }

    items.sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : a.occurredAt > b.occurredAt ? -1 : 0));
    return items.slice(0, 12);
  }

  async getOverview() {
    const [totalUsers, activeUsers, totalParas, totalRukus, totalAyahs] = await Promise.all([
      this.userRepo.count(),
      this.userRepo.count({ where: { isActive: true } }),
      this.paraRepo.count(),
      this.rukuRepo.count(),
      this.ayahRepo.count(),
    ]);

    const completedRukusRow = await this.progressRepo
      .createQueryBuilder('up')
      .select('COUNT(*)', 'count')
      .where('up.completedAt IS NOT NULL')
      .getRawOne<{ count: string }>();
    const completedRukus = Number(completedRukusRow?.count ?? 0);

    const completedParasRow = await this.progressRepo
      .createQueryBuilder('up')
      .leftJoin('up.ruku', 'r')
      .select('COUNT(DISTINCT r.paraId)', 'count')
      .where('up.completedAt IS NOT NULL')
      .getRawOne<{ count: string }>();
    const completedParas = Number(completedParasRow?.count ?? 0);

    const quizAccuracyRow = await this.quizAttemptRepo
      .createQueryBuilder('qa')
      .select('AVG(CASE WHEN qa.isCorrect = true THEN 1.0 ELSE 0.0 END)', 'avgCorrect')
      .getRawOne<{ avgCorrect: string }>();
    const averageQuizScore = Number(quizAccuracyRow?.avgCorrect ?? 0) * 100;

    const recentActivities = await this.getRecentActivities().catch(() => []);

    return {
      totalUsers,
      activeUsers,
      totalParas,
      totalRukus,
      totalAyahs,
      completedParas,
      completedRukus,
      averageQuizScore,
      recentActivities,
    };
  }
}