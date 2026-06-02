import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { MenusModule } from './menus/menu.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { InventoryModule } from './inventory/nventory.module';
import { OrdersModule } from './orders/orders.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { DocumentsModule } from './documents/documents.module';
import { ExpensesModule } from './expenses/expenses.module';
import { QrModule } from './qr/qr.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { PosModule } from './pos/pos.module';
import { KdsModule } from './kds/kds.module';
import { TablesModule } from './tables/tables.module';
import { WaitersModule } from './waiters/waiters.module';
import { KitchenInventoryModule } from './kitchen-inventory/kitchen-inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
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
  ],
})
export class AppModule { }
