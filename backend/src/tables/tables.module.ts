import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { RestaurantTable } from './entities/table.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RestaurantTable])],
    controllers: [TablesController],
    providers: [TablesService],
})
export class TablesModule { }