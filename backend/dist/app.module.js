"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const menu_module_1 = require("./menus/menu.module");
const restaurants_module_1 = require("./restaurants/restaurants.module");
const nventory_module_1 = require("./inventory/nventory.module");
const orders_module_1 = require("./orders/orders.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const documents_module_1 = require("./documents/documents.module");
const expenses_module_1 = require("./expenses/expenses.module");
const qr_module_1 = require("./qr/qr.module");
const analytics_module_1 = require("./analytics/analytics.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST'),
                    port: config.get('DB_PORT'),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_NAME'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                }),
            }),
            analytics_module_1.AnalyticsModule,
            auth_module_1.AuthModule,
            documents_module_1.DocumentsModule,
            expenses_module_1.ExpensesModule,
            nventory_module_1.InventoryModule,
            menu_module_1.MenusModule,
            notifications_module_1.NotificationsModule,
            orders_module_1.OrdersModule,
            qr_module_1.QrModule,
            restaurants_module_1.RestaurantsModule,
            roles_module_1.RolesModule,
            subscriptions_module_1.SubscriptionsModule,
            users_module_1.UsersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map