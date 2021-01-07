import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import configuration from '../config/configuration';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      // secret: `${configuration().auth.secret}`,
      secret: 'asupersecretpassword',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [
    PassportModule,
    JwtModule
  ]
})
export class AuthModule {}
