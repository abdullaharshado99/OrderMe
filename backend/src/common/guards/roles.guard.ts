import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!requiredRoles) return true;

    const { user }: { user?: { role?: { name?: string } } } = ctx
      .switchToHttp()
      .getRequest();
    if (!user?.role?.name) return false;

    return requiredRoles.includes(user.role.name);
  }
}
