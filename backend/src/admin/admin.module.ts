import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { User } from '../users/entities/user.entity';
import { Para } from '../content/entities/para.entity';
import { Ruku } from '../content/entities/ruku.entity';
import { Ayah } from '../content/entities/ayah.entity';
import { ContentModule } from '../content/content.module';
import { Surah } from 'src/content/entities/surah.entity';
import { ProgressModule } from '../progress/progress.module';
import { ExamsModule } from '../assessments/exams/exams.module';
import { Exam } from '../assessments/exams/entities/exam.entity';
import { Quiz } from '../assessments/quizzes/entities/quiz.entity';
import { RukuMedia } from 'src/content/entities/ruku-media.entity';
import { QuizzesModule } from '../assessments/quizzes/quizzes.module';
import { AdminContentService } from './services/admin-content.service';
import { TextContent } from 'src/content/entities/text-content.entity';
import { VideoContent } from '../content/entities/video-content.entity';
import { AudioContent } from '../content/entities/audio-content.entity';
import { UserProgress } from '../progress/entities/user-progress.entity';
import { AdminAnalyticsService } from './services/admin-analytics.service';
import { AdminMediaController } from './controllers/admin-media.controller';
import { AdminParasController } from './controllers/admin-paras.controller';
import { AdminRukusController } from './controllers/admin-rukus.controller';
import { AdminAyahsController } from './controllers/admin-ayahs.controller';
import { AdminExamsController } from './controllers/admin-exams.controller';
import { AdminSurahController } from './controllers/admin-surahs.controller';
import { ExamAttempt } from '../assessments/exams/entities/exam-attempt.entity';
import { AdminQuizzesController } from './controllers/admin-quizzes.controller';
import { ExamQuestion } from '../assessments/exams/entities/exam-question.entity';
import { AdminManagersController } from './controllers/admin-managers.controller';
import { QuizAttempt } from '../assessments/quizzes/entities/quiz-attempt.entity';
import { AdminAnalyticsController } from './controllers/admin-analytics.controller';
import { AdminRukuMediaController } from './controllers/admin-ruku-media.controller';
import { AdminTextContentController } from './controllers/admin-text-content.controller';
import { AdminAudioContentController } from './controllers/admin-audio-content.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Para,
            Surah,
            Ruku,
            Ayah,
            VideoContent,
            AudioContent,
            TextContent,
            RukuMedia,
            Quiz,
            Exam,
            ExamQuestion,
            QuizAttempt,
            ExamAttempt,
            User,
            UserProgress,
        ]),
        ContentModule,
        QuizzesModule,
        ExamsModule,
        ProgressModule,
        UsersModule,
        RolesModule,
    ],
    controllers: [
        AdminTextContentController,
        AdminParasController,
        AdminSurahController,
        AdminRukusController,
        AdminAyahsController,
        AdminMediaController,
        AdminRukuMediaController,
        AdminExamsController,
        AdminQuizzesController,
        AdminAnalyticsController,
        AdminManagersController,
        AdminAudioContentController,
    ],
    providers: [AdminContentService, AdminAnalyticsService],
})
export class AdminModule { }