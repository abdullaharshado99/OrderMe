import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Para } from './content/entities/para.entity';
import { Ruku } from './content/entities/ruku.entity';
import { Ayah } from './content/entities/ayah.entity';
import { Surah } from './content/entities/surah.entity';
import { Exam } from './assessments/exams/entities/exam.entity';
import { RukuMedia } from './content/entities/ruku-media.entity';
import { Quiz } from './assessments/quizzes/entities/quiz.entity';
import { TextContent } from './content/entities/text-content.entity';
import { VideoContent } from './content/entities/video-content.entity';
import { AudioContent } from './content/entities/audio-content.entity';
import { UserProgress } from './progress/entities/user-progress.entity';
import { ResumeTracking } from './resume/entities/resume-tracking.entity';
import { ExamAttempt } from './assessments/exams/entities/exam-attempt.entity';
import { ExamQuestion } from './assessments/exams/entities/exam-question.entity';
import { QuizAttempt } from './assessments/quizzes/entities/quiz-attempt.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Ayah,
    User,
    Role,
    Exam,
    ExamQuestion,
    ExamAttempt,
    Quiz,
    QuizAttempt,
    Para,
    Surah,
    Ruku,
    VideoContent,
    AudioContent,
    TextContent,
    UserProgress,
    ResumeTracking,
    RukuMedia,
  ],
  // migrations: ['src/migrations/*.ts'],
  synchronize: true,
});