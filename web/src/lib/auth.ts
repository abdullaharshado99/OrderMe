export type RoleName = 'SUPER_ADMIN' | 'RESTAURANT_OWNER' | 'CHEF' | 'CUSTOMER';

export interface RoleDto {
    id: number;
    name: RoleName;
}

export type UserRole = RoleName | number | RoleDto;

export interface AuthUser {
    id: number;
    email: string;
    role: RoleName;
    name: string;
    restaurantId?: number | null;
}

export const ACCESS_TOKEN_COOKIE = 'lwq_admin_token';

function getRoleName(role: UserRole | undefined | null): RoleName | null {
    if (!role) return null;
    if (typeof role === 'string') return role as RoleName;
    if (typeof role === 'number') return null;
    return role.name;
}

export function isSuperAdmin(role?: RoleName): boolean {
    return role === 'SUPER_ADMIN';
}

export function isRestaurantOwner(role?: RoleName): boolean {
    return role === 'RESTAURANT_OWNER';
}

export function isChef(role?: RoleName): boolean {
    return role === 'CHEF';
}

export function isCustomer(role?: RoleName): boolean {
    return role === 'CUSTOMER';
}