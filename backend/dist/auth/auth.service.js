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
const bcrypt = __importStar(require("bcryptjs"));
const typeorm_1 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const common_1 = require("@nestjs/common");
const role_entity_1 = require("../roles/entities/role.entity");
let AuthService = class AuthService {
    constructor(usersRepo, rolesRepo, jwtService, configService) {
        this.usersRepo = usersRepo;
        this.rolesRepo = rolesRepo;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    toUserResponse(user) {
        return {
            id: user.id,
            role: {
                id: user.role?.id ?? 1,
                name: user.role?.name ?? 'USER',
            },
            name: user.name ?? null,
            email: user.email,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async register(dto) {
        const existing = await this.usersRepo.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.UnauthorizedException('Email already in use');
        }
        const role = await this.rolesRepo.findOne({ where: { name: 'CUSTOMER' } });
        if (!role) {
            throw new common_1.UnauthorizedException('Default role USER not configured');
        }
        const passwordHash = await bcrypt.hash(dto.password ?? '', this.configService.get('BCRYPT_ROUNDS', 10));
        const user = this.usersRepo.create({
            email: dto.email,
            name: dto.name,
            passwordHash,
            role,
        });
        await this.usersRepo.save(user);
        return this.toUserResponse(user);
    }
    async registerAdmin(dto) {
        const existing = await this.usersRepo.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.UnauthorizedException('Email already in use');
        }
        const role = await this.rolesRepo.findOne({ where: { name: 'SUPER_ADMIN' } });
        if (!role) {
            throw new common_1.UnauthorizedException('Admin role ADMIN not configured');
        }
        const passwordHash = await bcrypt.hash(dto.password, this.configService.get('BCRYPT_ROUNDS', 10));
        const user = this.usersRepo.create({
            email: dto.email,
            name: dto.name,
            passwordHash,
            role,
        });
        await this.usersRepo.save(user);
        return this.toUserResponse(user);
    }
    async login(dto) {
        const user = await this.usersRepo.findOne({
            where: { email: dto.email },
            relations: ['role'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password ?? '', user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.toUserResponse(user);
    }
    async getLoginResult(dto) {
        const user = await this.usersRepo.findOne({
            where: { email: dto.email },
            relations: ['role'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password ?? '', user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const session_token = await this.createSessionToken(user);
        return { user: this.toUserResponse(user), session_token };
    }
    async createSessionToken(user) {
        const secret = this.configService.get('JWT_ACCESS_SECRET') ??
            'JWT_ACCESS_SECRET';
        return this.jwtService.signAsync({ sub: user.id, purpose: 'session_exchange' }, { secret, expiresIn: '10m' });
    }
    async validateSessionToken(sessionToken) {
        try {
            const secret = this.configService.get('JWT_ACCESS_SECRET') ??
                'JWT_ACCESS_SECRET';
            const payload = await this.jwtService.verifyAsync(sessionToken, { secret });
            if (payload?.purpose !== 'session_exchange') {
                return null;
            }
            return this.validateUser(payload.sub);
        }
        catch {
            return null;
        }
    }
    async validateUser(userId) {
        return this.usersRepo.findOne({
            where: { id: userId },
            relations: ['role'],
        });
    }
    async issueTokens(user) {
        const payload = {
            sub: user.id,
            role: user?.role?.name ?? 'USER',
        };
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET') ??
                'JWT_REFRESH_SECRET',
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '7d',
        });
        return { access_token, refresh_token };
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
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map