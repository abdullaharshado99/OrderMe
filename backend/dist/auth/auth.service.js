"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const common_1 = require("@nestjs/common");
let AuthService = class AuthService {
    constructor(userRepository, roleRepository, jwtService, configService, subscriptionsService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.subscriptionsService = subscriptionsService;
        this.refreshTokenBlacklist = new Set();
    }
    async register(dto) {
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already exists');
        const role = await this.roleRepository.findOne({ where: { name: dto.role } });
        if (!role)
            throw new common_1.BadRequestException('Invalid role');
        if ((dto.role === role_entity_1.RoleName.RESTAURANT_OWNER || dto.role === role_entity_1.RoleName.CHEF) &&
            !dto.restaurantId) {
            throw new common_1.BadRequestException('restaurantId is required for RESTAURANT_OWNER, CHEF');
        }
        const hashedPassword = await bcrypt.hash(dto.password ?? '', 10);
        const user = this.userRepository.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            phone: dto.phone,
            roleId: role.id,
            restaurantId: dto.restaurantId || null,
        });
        await this.userRepository.save(user);
        if (dto.plan && (dto.role === role_entity_1.RoleName.RESTAURANT_OWNER || dto.role === role_entity_1.RoleName.SUPER_ADMIN)) {
            try {
                await this.subscriptionsService.createSubscriptionFromPlan(user.restaurantId, dto.plan);
            }
            catch (err) {
                console.error('Failed to create subscription', err);
            }
        }
        const payload = { sub: user.id, email: user.email, role: role.name, restaurantId: user.restaurantId };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN')
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            secret: this.configService.get('JWT_REFRESH_SECRET')
        });
        return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: role.name } };
    }
    async login(dto) {
        const user = await this.userRepository.findOne({ where: { email: dto.email }, relations: ['role'] });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isPasswordValid = await bcrypt.compare(dto.password ?? '', user.password ?? '');
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isActive)
            throw new common_1.UnauthorizedException('Account disabled');
        const payload = { sub: user.id, email: user.email, role: user.role?.name, restaurantId: user.restaurantId };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN')
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            secret: this.configService.get('JWT_REFRESH_SECRET')
        });
        return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role?.name } };
    }
    async refreshTokens(refreshToken) {
        if (this.refreshTokenBlacklist.has(refreshToken)) {
            throw new common_1.UnauthorizedException('Token revoked');
        }
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET')
            });
            const user = await this.userRepository.findOne({ where: { id: payload.sub }, relations: ['role'] });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            const newPayload = { sub: user.id, email: user.email, role: user.role?.name, restaurantId: user.restaurantId };
            const newAccessToken = this.jwtService.sign(newPayload, {
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN')
            });
            const newRefreshToken = this.jwtService.sign(newPayload, {
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
                secret: this.configService.get('JWT_REFRESH_SECRET')
            });
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(refreshToken) {
        this.refreshTokenBlacklist.add(refreshToken);
        return { message: 'Logged out successfully' };
    }
    async validateSessionToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepository.findOne({
                where: { id: payload.sub },
                relations: ['role'],
            });
            return user || null;
        }
        catch (error) {
            return null;
        }
    }
    async validateUser(userId) {
        return this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_2.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        subscriptions_service_1.SubscriptionsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map