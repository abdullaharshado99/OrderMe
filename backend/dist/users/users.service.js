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
exports.UsersService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
let UsersService = class UsersService {
    constructor(usersRepository, dataSource) {
        this.usersRepository = usersRepository;
        this.dataSource = dataSource;
    }
    async findByEmail(email) {
        return this.usersRepository.findOneBy({ email });
    }
    async findById(id, relations = ['role']) {
        return this.usersRepository.findOne({ where: { id }, relations });
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
    async getMe(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toUserResponse(user);
    }
    async updateMe(userId, dto) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.email && dto.email !== user.email) {
            const existing = await this.findByEmail(dto.email);
            if (existing && existing.id !== user.id) {
                throw new common_1.UnauthorizedException('Email already in use');
            }
            user.email = dto.email;
        }
        if (dto.name !== undefined) {
            user.name = dto.name;
        }
        await this.usersRepository.save(user);
        return this.toUserResponse(user);
    }
    async changePassword(userId, dto) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['id', 'passwordHash'],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.usersRepository.save(user);
    }
    async hardDeleteAccount(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['id'],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.dataSource.transaction(async (manager) => {
            // Remove user-linked rows that do not cascade.
            await manager
                .query(`DELETE FROM "resume_tracking" WHERE "userId" = $1`, [userId])
                .catch(() => undefined);
            await manager
                .query(`DELETE FROM "quiz_attempts" WHERE "userId" = $1`, [userId])
                .catch(() => undefined);
            await manager
                .query(`DELETE FROM "exam_attempts" WHERE "userId" = $1`, [userId])
                .catch(() => undefined);
            await manager
                .query(`DELETE FROM "user_progress" WHERE "userId" = $1`, [userId])
                .catch(() => undefined);
            await manager
                .query(`DELETE FROM "daily_activity" WHERE "userId" = $1`, [userId])
                .catch(() => undefined);
            await manager
                .query(`DELETE FROM "user_goals" WHERE "userId" = $1`, [userId])
                .catch(() => undefined);
            await manager
                .query(`DELETE FROM "user_learning_stats" WHERE "userId" = $1`, [
                userId,
            ])
                .catch(() => undefined);
            // Finally delete the user.
            await manager.query(`DELETE FROM "users" WHERE "id" = $1`, [userId]);
        });
        return { deleted: true };
    }
    async findAll() {
        const users = await this.usersRepository.find({
            relations: ['role'],
            order: { id: 'ASC' },
        });
        return users.map((u) => this.toUserResponse(u));
    }
    async createUser(email, plainPassword, name) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        const user = this.usersRepository.create({
            email,
            passwordHash: hashedPassword,
            name,
        });
        return this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.DataSource])
], UsersService);
//# sourceMappingURL=users.service.js.map