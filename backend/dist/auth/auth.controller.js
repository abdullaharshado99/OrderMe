"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jwt_1 = require("@nestjs/jwt");
const login_dto_1 = require("./dto/login.dto");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
const register_dto_1 = require("./dto/register.dto");
const user_entity_1 = require("../users/entities/user.entity");
const common_1 = require("@nestjs/common");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const session_token_guard_1 = require("./session-token.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
let AuthController = class AuthController {
    constructor(authService, jwtService, configService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(dto) {
        const user = await this.authService.register(dto);
        return user;
    }
    async registerAdmin(dto) {
        const user = await this.authService.registerAdmin(dto);
        return user;
    }
    async login(dto) {
        return this.authService.getLoginResult(dto);
    }
    async getTokens(user) {
        return this.authService.issueTokens(user);
    }
    logout() {
        return { message: 'Logged out successfully' };
    }
    async refresh(dto) {
        const token = dto.refresh_token ?? dto.refreshToken;
        if (!token) {
            throw new common_1.UnauthorizedException('refresh_token or refreshToken is required. After login, call GET /auth/tokens with Authorization: Bearer <session_token> to get tokens.');
        }
        try {
            const refreshSecret = this.configService.get('JWT_REFRESH_SECRET') ??
                'JWT_REFRESH_SECRET';
            const payload = await this.jwtService.verifyAsync(token, {
                secret: refreshSecret,
            });
            if (!payload ||
                (typeof payload.sub !== 'string' && typeof payload.sub !== 'number')) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const userId = typeof payload.sub === 'string' ? Number(payload.sub) : payload.sub;
            if (typeof userId !== 'number' || Number.isNaN(userId)) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const user = await this.authService.validateUser(userId);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.authService.issueTokens(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_2.Post)('register'),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns created user (no tokens)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Email already in use' }),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_2.Post)('register-admin'),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new admin user (role ADMIN)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns created admin user (no tokens)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Email already in use or admin role misconfigured',
    }),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerAdmin", null);
__decorate([
    (0, common_2.Post)('login'),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Login - returns user + session_token. Call GET /auth/tokens with session_token to get access_token and refresh_token.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user object and session_token (use in Authorization header for GET /auth/tokens)',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_2.Get)('tokens'),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    (0, common_2.Header)('Cache-Control', 'no-store'),
    (0, common_2.UseGuards)(session_token_guard_1.SessionTokenGuard),
    (0, swagger_1.ApiBearerAuth)('session_token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get access_token and refresh_token. Requires session_token from login (Authorization: Bearer <session_token>). Tokens returned in response body only.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns access_token and refresh_token in body',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or missing session token; login first',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getTokens", null);
__decorate([
    (0, common_2.Post)('logout'),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Logout - client clears tokens; endpoint for consistency and future token invalidation',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logged out successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_2.Post)('refresh'),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh tokens - send refresh_token in body (not email/password). Get tokens first via GET /auth/tokens.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns new access_token and refresh_token',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing refresh_token' }),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_2.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map