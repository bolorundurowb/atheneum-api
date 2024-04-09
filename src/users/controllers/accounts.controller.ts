import { Body, Controller, Delete, Get, Put, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserProfileDto } from '../dtos/user-profile.dto';
import { UsersService } from '../services/users.service';
import { PasswordUpdateDto } from '../dtos/password-update.dto';
import { MessageDto } from '../../auth/dtos/message.dto';
import { User } from '../schemas/user.schema';
import { BooksService } from '../../books/services/books.service';
import { PublisherService } from '../../books/services/publisher.service';
import { AuthorService } from '../../books/services/author.service';

@ApiTags('Accounts')
@UseGuards(JwtAuthGuard)
@Controller('v1/accounts')
export class AccountsController {
  constructor(
    private userService: UsersService,
    private bookService: BooksService,
    private publisherService: PublisherService,
    private authorService: AuthorService
  ) {}

  @Delete('delete')
  @ApiOkResponse({
    description: 'Account deleted'
  })
  async deleteAccount(@Request() req): Promise<void> {
    const userId = req.user.id;
    await this.authorService.removeOwned(userId);
    await this.publisherService.removeOwned(userId);
    await this.bookService.removeOwned(userId);
    await this.userService.removeAccount(userId);
  }
}
