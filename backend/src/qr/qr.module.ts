import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { QrCode } from './entities/qr.entity';

@Module({
    imports: [TypeOrmModule.forFeature([QrCode])],
    controllers: [QrController],
    providers: [QrService],
})
export class QrModule { }