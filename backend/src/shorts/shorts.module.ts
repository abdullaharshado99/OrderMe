import { Module } from '@nestjs/common';
import { Short } from './entities/short.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortsService } from './shorts.service';
import { ShortsController } from './shorts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Short])],
  controllers: [ShortsController],
  providers: [ShortsService],
})
export class ShortsModule { }