export type RoleName = 'USER' | 'ADMIN' | 'SUPER-ADMIN';

export interface RoleDto {
    id: number;
    name: RoleName;
}

export type UserRole = RoleName | number | RoleDto;

export interface AuthUser {
    id: number;
    email: string;
    role: UserRole;
    name?: string | null;
}

export const ACCESS_TOKEN_COOKIE = 'lwq_admin_token';

function getRoleName(role: UserRole | undefined | null): RoleName | null {
    if (!role) return null;
    if (typeof role === 'string') return role as RoleName;
    if (typeof role === 'number') return null;
    return role.name;
}

export function isAdminRole(role: UserRole | undefined | null) {
    const name = getRoleName(role);
    return name === 'ADMIN' || name === 'SUPER-ADMIN';
}

export function isSuperAdminRole(role: UserRole | undefined | null) {
    const name = getRoleName(role);
    return name === 'SUPER-ADMIN';
}