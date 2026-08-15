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
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const role_entity_1 = require("../roles/entities/role.entity");
const register_dto_1 = require("./dto/register.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const common_1 = require("@nestjs/common");
let AuthController = class AuthController {
    constructor(authService, subscriptionsService) {
        this.authService = authService;
        this.subscriptionsService = subscriptionsService;
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async login(dto) {
        return this.authService.login(dto);
    }
    async refresh(refreshToken) {
        return this.authService.refreshTokens(refreshToken);
    }
    async logout(refreshToken) {
        return this.authService.logout(refreshToken);
    }
    async getPlans() {
        return this.subscriptionsService.getAllPlans();
    }
    async upgradeSubscription(id, plan, req) {
        if (req.user.restaurantId !== id && req.user.role !== role_entity_1.RoleName.SUPER_ADMIN) {
            throw new common_1.ForbiddenException();
        }
        return this.subscriptionsService.upgradeSubscription(id, plan);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Post)('upgrade/:restaurantId'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.RESTAURANT_OWNER),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Body)('plan')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "upgradeSubscription", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        subscriptions_service_1.SubscriptionsService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map