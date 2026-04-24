import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AdminModule } from './admin/admin.module';
import { ResumeModule } from './resume/resume.module';
import { ContentModule } from './content/content.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProgressModule } from './progress/progress.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExamsModule } from './assessments/exams/exams.module';
import { QuranSyncModule } from './quran-sync/quran-sync.module';
import { QuizzesModule } from './assessments/quizzes/quizzes.module';
import { ChunkUploadModule } from './chunk-upload/chunk-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,//config.get<string>('NODE_ENV') === 'development',
        // migrationsRun: true,
        // migrations: [__dirname + '/migrations/*{.ts,.js}'],
      }),
    }),
    AuthModule,
    AdminModule,
    UsersModule,
    QuizzesModule,
    ExamsModule,
    ProgressModule,
    ResumeModule,
    ContentModule,
    RolesModule,
    QuranSyncModule,
    ChunkUploadModule,
  ],
})
export class AppModule { }