/**
 * Created by bolorundurowb on 12/27/2020
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(emailAddress: string, password: string): Promise<any> {
    const user = await this.authService.login(emailAddress, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
