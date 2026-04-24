import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { UpdateMeDto, ChangePasswordDto } from './dto/update-me.dto';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

export interface UserResponseDto {
    id: number;
    name: string | null;
    email: string;
    role: {
        id: number;
        name: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async findById(id: number, relations: string[] = ['role']): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id }, relations });
    }

    toUserResponse(user: User): UserResponseDto {
        return {
            id: user.id,
            role: {
                id: user.role?.id ?? 1,
                name: user.role?.name ?? 'USER',
            },
            name: user.name ?? null,
            email: user.email,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async getMe(userId: number): Promise<UserResponseDto> {
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.toUserResponse(user);
    }

    async updateMe(userId: number, dto: UpdateMeDto): Promise<UserResponseDto> {
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (dto.email && dto.email !== user.email) {
            const existing = await this.findByEmail(dto.email);
            if (existing && existing.id !== user.id) {
                throw new UnauthorizedException('Email already in use');
            }
            user.email = dto.email;
        }

        if (dto.name !== undefined) {
            user.name = dto.name;
        }

        await this.usersRepository.save(user);
        return this.toUserResponse(user);
    }

    async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { id: userId }, select: ['id', 'passwordHash'] });
        if (!user) throw new NotFoundException('User not found');

        const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Current password is incorrect');

        user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.usersRepository.save(user);
    }

    async hardDeleteAccount(userId: number): Promise<{ deleted: boolean }> {
        const user = await this.usersRepository.findOne({ where: { id: userId }, select: ['id'] });
        if (!user) throw new NotFoundException('User not found');

        await this.dataSource.transaction(async (manager) => {
            // Remove user-linked rows that do not cascade.
            await manager.query(`DELETE FROM "resume_tracking" WHERE "userId" = $1`, [userId]).catch(() => undefined);
            await manager.query(`DELETE FROM "quiz_attempts" WHERE "userId" = $1`, [userId]).catch(() => undefined);
            await manager.query(`DELETE FROM "exam_attempts" WHERE "userId" = $1`, [userId]).catch(() => undefined);
            await manager.query(`DELETE FROM "user_progress" WHERE "userId" = $1`, [userId]).catch(() => undefined);
            await manager.query(`DELETE FROM "daily_activity" WHERE "userId" = $1`, [userId]).catch(() => undefined);
            await manager.query(`DELETE FROM "user_goals" WHERE "userId" = $1`, [userId]).catch(() => undefined);
            await manager.query(`DELETE FROM "user_learning_stats" WHERE "userId" = $1`, [userId]).catch(() => undefined);

            // Finally delete the user.
            await manager.query(`DELETE FROM "users" WHERE "id" = $1`, [userId]);
        });

        return { deleted: true };
    }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.usersRepository.find({ relations: ['role'], order: { id: 'ASC' } });
        return users.map(u => this.toUserResponse(u));
    }

    async createUser(email: string, plainPassword: string, name?: string) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        const user = this.usersRepository.create({
            email,
            passwordHash: hashedPassword,
            name,
        });

        return this.usersRepository.save(user);
    }
}