import { Module } from '@nestjs/common';
import { KdsService } from './kds.service';
import { KdsController } from './kds.controller';

@Module({
  providers: [KdsService],
  controllers: [KdsController]
})
export class KdsModule {}
