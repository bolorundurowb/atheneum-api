import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import configuration from '../config/configuration';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    UsersModule,
    SharedModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secretOrPrivateKey: configuration().auth.secret,
        signOptions: { expiresIn: '30d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
