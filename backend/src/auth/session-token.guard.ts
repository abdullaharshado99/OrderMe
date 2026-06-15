import { Request } from 'express';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

@Injectable()
export class SessionTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers?.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;
    if (!token) {
      throw new UnauthorizedException(
        'Session token required. Login first, then send Authorization: Bearer <session_token>.',
      );
    }

    const user: User | null =
      await this.authService.validateSessionToken(token);
    if (!user) {
      throw new UnauthorizedException(
        'Invalid or expired session token. Please login again.',
      );
    }

    request.user = user;
    return true;
  }
}