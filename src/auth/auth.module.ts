import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import configuration from '../config/configuration';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SharedModule } from '../shared/shared.module';
import { SocialAuthService } from './services/social-auth.service';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    SharedModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: configuration().auth.secret,
        signOptions: { expiresIn: '365d' }
      })
    })
  ],
  providers: [AuthService, JwtStrategy, SocialAuthService],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule]
})
export class AuthModule {}
