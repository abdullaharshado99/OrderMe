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
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
const role_entity_1 = require("../roles/entities/role.entity");
let AuthService = class AuthService {
    constructor(userRepository, roleRepository, jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
    }
    async register(dto) {
        // Check if user exists
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already exists');
        // Get role entity
        const role = await this.roleRepository.findOne({ where: { name: dto.role } });
        if (!role)
            throw new common_1.BadRequestException('Invalid role');
        // Validation for restaurant-owner and chef require restaurantId
        if ((dto.role === role_entity_1.RoleName.RESTAURANT_OWNER || dto.role === role_entity_1.RoleName.CHEF) && !dto.restaurantId) {
            throw new common_1.BadRequestException('restaurantId is required for restaurant-owner or chef');
        }
        // Hash password
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
        // Generate tokens
        const payload = { sub: user.id, email: user.email, role: role.name, restaurantId: user.restaurantId };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
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
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role?.name } };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userRepository.findOne({ where: { id: payload.sub }, relations: ['role'] });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            const newPayload = { sub: user.id, email: user.email, role: user.role?.name, restaurantId: user.restaurantId };
            const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '1d' });
            return { accessToken: newAccessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout() {
        // In production, you might blacklist the token. For now, just return.
        return { message: 'Logged out successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map