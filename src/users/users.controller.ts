import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileDto } from './dtos/user-profile.dto';
import { UsersService } from './services/users.service';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('v1/users')
export class UsersController {
  constructor(private userService: UsersService) {
  }

  @Get('current')
  getCallerProfile(@Request() req) {
    return req.user;
  }

  @Put('current')
  async updateCallerProfile(@Request() req, @Body() payload: UserProfileDto) {
    const userId = req.user.id;
    return await this.userService.update(userId, payload);
  }
}
