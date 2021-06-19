import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../dtos/auth.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(emailAddress: string, password: string): Promise<AuthDto> {
    const user = await this.userService.findByEmail(emailAddress);

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      return {
        authToken: this.generateAuthToken(user),
        fullName: `${user.firstName} ${user.lastName}`,
        emailAddress: user.emailAddress,
      };
    }

    throw new UnauthorizedException(null, 'User account not found.');
  }

  async register(emailAddress: string, password: string): Promise<AuthDto> {
    let user = await this.userService.findByEmail(emailAddress);

    if (user) {
      throw new ConflictException(null, 'User account already exists.');
    }

    user = await this.userService.create(emailAddress, password);
    return {
      authToken: this.generateAuthToken(user),
      fullName: `${user.firstName} ${user.lastName}`,
      emailAddress: user.emailAddress,
    };
  }

  async requestReset(emailAddress: string): Promise<AuthDto> {
    let user = await this.userService.findByEmail(emailAddress);

    if (user) {
      throw new ConflictException(null, 'User account already exists.');
    }

    user = await this.userService.create(emailAddress, password);
    return {
      authToken: this.generateAuthToken(user),
      fullName: `${user.firstName} ${user.lastName}`,
      emailAddress: user.emailAddress,
    };
  }

  private generateAuthToken(user: any): string {
    return this.jwtService.sign({
      email: user.emailAddress,
      id: user._id,
      sub: uuid(),
    });
  }
}
