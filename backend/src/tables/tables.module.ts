import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { RestaurantTable } from './entities/table.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RestaurantTable])],
    controllers: [TablesController],
    providers: [TablesService],
})
export class TablesModule { }