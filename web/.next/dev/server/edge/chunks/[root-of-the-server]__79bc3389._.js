(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__79bc3389._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/web/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
// import { ACCESS_TOKEN_COOKIE } from '@/lib/auth';
const ADMIN_PATHS = [
    '/dashboard',
    '/media'
];
function middleware(request) {
    const { pathname } = request.nextUrl;
    const requiresAuth = ADMIN_PATHS.some((path)=>pathname.startsWith(path));
    if (!requiresAuth) return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    // const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    // if (!token) {
    //     const loginUrl = new URL('/login', request.url);
    //     return NextResponse.redirect(loginUrl);
    // }
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/dashboard/:path*',
        '/media/:path*'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__79bc3389._.js.map