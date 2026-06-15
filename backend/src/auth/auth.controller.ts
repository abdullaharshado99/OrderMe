import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleName } from '../roles/entities/role.entity';
import { RegisterDto, LoginDto } from './dto/register.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Param, ForbiddenException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private subscriptionsService: SubscriptionsService
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.getAllPlans();
  }

  @Post('upgrade/:restaurantId')
  @Roles(RoleName.RESTAURANT_OWNER)
  async upgradeSubscription(@Param('restaurantId') id: number, @Body('plan') plan: string, @Request() req) {
    if (req.user.restaurantId !== id && req.user.role !== RoleName.SUPER_ADMIN) {
      throw new ForbiddenException();
    }
    return this.subscriptionsService.upgradeSubscription(id, plan);
  }
}