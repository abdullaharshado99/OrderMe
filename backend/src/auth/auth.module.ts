import * as ms from 'ms';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { SessionTokenGuard } from './session-token.guard';
import { RefreshTokenStrategy } from './refresh-token.strategy';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret =
          config.get<string>('JWT_ACCESS_SECRET') ?? 'JWT_ACCESS_SECRET';
        const expiresIn = config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '90m';

        return {
          secret,
          signOptions: { expiresIn: expiresIn as ms.StringValue },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    SessionTokenGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
