import { Module } from '@nestjs/common';
import { Deal } from './entities/deal.entity';
import { DealsService } from './deals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsController } from './deals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Deal])],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule { }