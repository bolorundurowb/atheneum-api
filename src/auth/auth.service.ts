import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(emailAddress: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(emailAddress);

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      const payload = { email: user.emailAddress, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
        user: user,
      };
    }

    throw new UnauthorizedException();
  }
}
