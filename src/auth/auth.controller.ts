import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CredentialsDto } from './dtos/credentials.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthDto } from './dtos/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({
    description: 'User credentials were verified successfully',
    type: AuthDto,
  })
  @ApiUnauthorizedResponse({
    description: 'A user account unverified',
  })
  async login(@Body() credentials: CredentialsDto): Promise<AuthDto> {
    return this.authService.login(
      credentials.emailAddress,
      credentials.password,
    );
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'User account created successfully',
    type: AuthDto,
  })
  @ApiConflictResponse({
    description: 'A user account exists with the provided email',
  })
  async register(@Body() credentials: CredentialsDto): Promise<AuthDto> {
    return this.authService.register(
      credentials.emailAddress,
      credentials.password,
    );
  }
}
