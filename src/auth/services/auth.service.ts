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
import { CodeService } from '../../shared/services/code.service';
import { UserDocument } from '../../users/schemas/user.schema';
import { EmailService } from '../../shared/services/email.service';
import { TemplateService } from '../../shared/services/template.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private codeService: CodeService,
    private emailService: EmailService,
    private templateService: TemplateService,
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

  async forgotPassword(emailAddress: string): Promise<void> {
    const user = await this.userService.findByEmail(emailAddress);

    if (!user) {
      throw new ConflictException(null, 'User account not found.');
    }

    const resetCode = this.codeService.generateResetCode();
    user.resetCode = resetCode;
    await (<UserDocument>user).save();

    // send an email to the user
    const content = await this.templateService.getForgotPasswordContent(
      user.firstName,
      resetCode,
    );
    console.log(content);
    await this.emailService.send(user.emailAddress, 'Your reset code', content);
  }

  private generateAuthToken(user: any): string {
    return this.jwtService.sign({
      email: user.emailAddress,
      id: user._id,
      sub: uuid(),
    });
  }
}
