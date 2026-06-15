import { Module } from '@nestjs/common';
import { QrModule } from './qr/qr.module';
import { PosModule } from './pos/pos.module';
import { KdsModule } from './kds/kds.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusModule } from './menus/menu.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { DealsModule } from './deals/deals.module';
import { FactsModule } from './facts/facts.module';
import { OrdersModule } from './orders/orders.module';
import { ShortsModule } from './shorts/shorts.module';
import { TablesModule } from './tables/tables.module';
import { WaitersModule } from './waiters/waiters.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InventoryModule } from './inventory/inventory.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DocumentsModule } from './documents/documents.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { KitchenInventoryModule } from './kitchen-inventory/kitchen-inventory.module';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: envFile, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DB_URL'),
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV === 'production' ? false : true,
      }),
    }),
    AnalyticsModule,
    WaitersModule,
    TablesModule,
    KitchenInventoryModule,
    AuthModule,
    DocumentsModule,
    ExpensesModule,
    InventoryModule,
    MenusModule,
    NotificationsModule,
    OrdersModule,
    QrModule,
    RestaurantsModule,
    RolesModule,
    SubscriptionsModule,
    UsersModule,
    WarehouseModule,
    PosModule,
    KdsModule,
    DealsModule,
    ShortsModule,
    FactsModule,
  ],
})
export class AppModule { }