import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto } from './dto/register.dto';
import { Role, RoleName } from '../roles/entities/role.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private refreshTokenBlacklist: Set<string> = new Set();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private subscriptionsService: SubscriptionsService
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const role = await this.roleRepository.findOne({ where: { name: dto.role } });
    if (!role) throw new BadRequestException('Invalid role');

    if (
      (dto.role === RoleName.RESTAURANT_OWNER || dto.role === RoleName.CHEF) &&
      !dto.restaurantId
    ) {
      throw new BadRequestException('restaurantId is required for RESTAURANT_OWNER, CHEF');
    }

    const hashedPassword = await bcrypt.hash(dto.password ?? '', 10);
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      phone: dto.phone,
      roleId: role.id,
      restaurantId: dto.restaurantId || null,
    });
    await this.userRepository.save(user);

    if (dto.plan && (dto.role === RoleName.RESTAURANT_OWNER || dto.role === RoleName.SUPER_ADMIN)) {
      try {
        await this.subscriptionsService.createSubscriptionFromPlan(user.restaurantId!, dto.plan);
      } catch (err) {
        console.error('Failed to create subscription', err);
      }
    }

    const payload = { sub: user.id, email: user.email, role: role.name, restaurantId: user.restaurantId };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') as any
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') as any,
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')
    });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: role.name } };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email }, relations: ['role'] });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password ?? '', user.password ?? '');
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account disabled');

    const payload = { sub: user.id, email: user.email, role: user.role?.name, restaurantId: user.restaurantId };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') as any
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') as any,
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')
    });
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role?.name } };
  }

  async refreshTokens(refreshToken: string) {
    if (this.refreshTokenBlacklist.has(refreshToken)) {
      throw new UnauthorizedException('Token revoked');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')
      });
      const user = await this.userRepository.findOne({ where: { id: payload.sub }, relations: ['role'] });
      if (!user) throw new UnauthorizedException('User not found');
      const newPayload = { sub: user.id, email: user.email, role: user.role?.name, restaurantId: user.restaurantId };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') as any
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') as any,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string) {
    this.refreshTokenBlacklist.add(refreshToken);
    return { message: 'Logged out successfully' };
  }

  async validateSessionToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['role'],
      });
      return user || null;
    } catch (error) {
      return null;
    }
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
  }
}