import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../../roles/entities/role.entity';

export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles);