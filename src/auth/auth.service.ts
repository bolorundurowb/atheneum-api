import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {
  }

  async login(emailAddress: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(emailAddress);
  }
}
