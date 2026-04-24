import { Role } from '../../roles/entities/role.entity';
import { UserProgress } from '../../progress/entities/user-progress.entity';
import { ResumeTracking } from '../../resume/entities/resume-tracking.entity';
import { ExamAttempt } from '../../assessments/exams/entities/exam-attempt.entity';
import { QuizAttempt } from '../../assessments/quizzes/entities/quiz-attempt.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @OneToMany(() => QuizAttempt, (qa) => qa.user)
    quizAttempts: QuizAttempt[];

    @OneToMany(() => ExamAttempt, (ea) => ea.user)
    examAttempts: ExamAttempt[];

    @OneToMany(() => UserProgress, (up) => up.user)
    progress: UserProgress[];

    @OneToMany(() => ResumeTracking, (rt) => rt.user)
    resumes: ResumeTracking[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}