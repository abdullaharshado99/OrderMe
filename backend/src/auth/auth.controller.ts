import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SessionTokenGuard } from './session-token.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'Returns created user (no tokens)' })
  @ApiResponse({ status: 401, description: 'Email already in use' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return user;
  }

  @Post('register-admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a new admin user (role ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Returns created admin user (no tokens)',
  })
  @ApiResponse({
    status: 401,
    description: 'Email already in use or admin role misconfigured',
  })
  async registerAdmin(@Body() dto: RegisterDto) {
    const user = await this.authService.registerAdmin(dto);
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Login - returns user + session_token. Call GET /auth/tokens with session_token to get access_token and refresh_token.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns user object and session_token (use in Authorization header for GET /auth/tokens)',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.getLoginResult(dto);
  }

  @Get('tokens')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @UseGuards(SessionTokenGuard)
  @ApiBearerAuth('session_token')
  @ApiOperation({
    summary:
      'Get access_token and refresh_token. Requires session_token from login (Authorization: Bearer <session_token>). Tokens returned in response body only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns access_token and refresh_token in body',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing session token; login first',
  })
  async getTokens(@CurrentUser() user: User) {
    return this.authService.issueTokens(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Logout - client clears tokens; endpoint for consistency and future token invalidation',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  logout() {
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Refresh tokens - send refresh_token in body (not email/password). Get tokens first via GET /auth/tokens.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns new access_token and refresh_token',
  })
  @ApiResponse({ status: 401, description: 'Invalid or missing refresh_token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    const token = dto.refresh_token ?? dto.refreshToken;
    if (!token) {
      throw new UnauthorizedException(
        'refresh_token or refreshToken is required. After login, call GET /auth/tokens with Authorization: Bearer <session_token> to get tokens.',
      );
    }
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ??
        'JWT_REFRESH_SECRET';
      const payload = await this.jwtService.verifyAsync<{
        sub?: string | number;
      }>(token, {
        secret: refreshSecret,
      });
      if (
        !payload ||
        (typeof payload.sub !== 'string' && typeof payload.sub !== 'number')
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const userId =
        typeof payload.sub === 'string' ? Number(payload.sub) : payload.sub;
      if (typeof userId !== 'number' || Number.isNaN(userId)) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const user = await this.authService.validateUser(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.authService.issueTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
