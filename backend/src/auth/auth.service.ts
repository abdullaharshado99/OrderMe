import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role, RoleName } from '../roles/entities/role.entity';
import { RegisterDto, LoginDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    // Check if user exists
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    // Get role entity
    const role = await this.roleRepository.findOne({ where: { name: dto.role } });
    if (!role) throw new BadRequestException('Invalid role');

    // Validation for restaurant-owner and chef require restaurantId
    if ((dto.role === RoleName.RESTAURANT_OWNER || dto.role === RoleName.CHEF) && !dto.restaurantId) {
      throw new BadRequestException('restaurantId is required for restaurant-owner or chef');
    }

    // Hash password
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

    // Generate tokens
    const payload = { sub: user.id, email: user.email, role: role.name, restaurantId: user.restaurantId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: role.name } };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email }, relations: ['role'] });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password ?? '', user.password ?? '');
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('Account disabled');

    const payload = { sub: user.id, email: user.email, role: user.role?.name, restaurantId: user.restaurantId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role?.name } };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({ where: { id: payload.sub }, relations: ['role'] });
      if (!user) throw new UnauthorizedException('User not found');

      const newPayload = { sub: user.id, email: user.email, role: user.role?.name, restaurantId: user.restaurantId };
      const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '1d' });
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout() {
    // In production, you might blacklist the token. For now, just return.
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
}