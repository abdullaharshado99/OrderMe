import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { ACCESS_TOKEN_COOKIE } from '@/lib/auth';

const ADMIN_PATHS = ['/dashboard', '/media'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const requiresAuth = ADMIN_PATHS.some(path => pathname.startsWith(path));

    if (!requiresAuth) return NextResponse.next();

    // const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

    // if (!token) {
    //     const loginUrl = new URL('/login', request.url);
    //     return NextResponse.redirect(loginUrl);
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/media/:path*'],
};