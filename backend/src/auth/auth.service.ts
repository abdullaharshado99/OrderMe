import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '../roles/entities/role.entity';

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
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id!,
      role: {
        id: user.role?.id ?? 1,
        name: user.role?.name ?? 'USER',
      },
      name: user.name ?? null,
      email: user.email!,
      isActive: user.isActive!,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    };
  }

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    const role = await this.rolesRepo.findOne({ where: { name: 'CUSTOMER' } });
    if (!role) {
      throw new UnauthorizedException('Default role USER not configured');
    }
    const passwordHash = await bcrypt.hash(
      dto.password ?? '',
      this.configService.get<number>('BCRYPT_ROUNDS', 10),
    );

    const user = this.usersRepo.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      role,
    } as Partial<User>);
    await this.usersRepo.save(user);
    return this.toUserResponse(user);
  }

  async registerAdmin(dto: RegisterDto): Promise<UserResponseDto> {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    const role = await this.rolesRepo.findOne({ where: { name: 'SUPER_ADMIN' } });
    if (!role) {
      throw new UnauthorizedException('Admin role ADMIN not configured');
    }

    const passwordHash = await bcrypt.hash(
      dto.password!,
      this.configService.get<number>('BCRYPT_ROUNDS', 10),
    );

    const user = this.usersRepo.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      role,
    } as Partial<User>);

    await this.usersRepo.save(user);
    return this.toUserResponse(user);
  }

  async login(dto: LoginDto): Promise<UserResponseDto> {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email },
      relations: ['role'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password ?? '', user.passwordHash!);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.toUserResponse(user);
  }

  async getLoginResult(
    dto: LoginDto,
  ): Promise<{ user: UserResponseDto; session_token: string }> {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email },
      relations: ['role'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password ?? '', user.passwordHash!);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const session_token = await this.createSessionToken(user);
    return { user: this.toUserResponse(user), session_token };
  }

  async createSessionToken(user: User): Promise<string> {
    const secret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ??
      'JWT_ACCESS_SECRET';
    return this.jwtService.signAsync(
      { sub: user.id, purpose: 'session_exchange' },
      { secret, expiresIn: '10m' },
    );
  }

  async validateSessionToken(sessionToken: string): Promise<User | null> {
    try {
      const secret =
        this.configService.get<string>('JWT_ACCESS_SECRET') ??
        'JWT_ACCESS_SECRET';
      const payload = await this.jwtService.verifyAsync<{
        sub: number;
        purpose?: string;
      }>(sessionToken, { secret });
      if (payload?.purpose !== 'session_exchange') {
        return null;
      }
      return this.validateUser(payload.sub);
    } catch {
      return null;
    }
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });
  }

  async issueTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: { sub: number; role: string } = {
      sub: user.id!,
      role: user?.role?.name ?? 'USER',
    };
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ??
        'JWT_REFRESH_SECRET',
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '7d',
    });
    return { access_token, refresh_token };
  }
}
