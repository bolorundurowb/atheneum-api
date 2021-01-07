import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BooksService } from './services/books.service';
import { BookIsbnDto } from './dtos/book-isbn.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookManualDto } from './dtos/book-manual.dto';

@ApiTags('Books')
@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Get()
  async getAll(@Request() req) {
    const userId = req.user.id;
    return this.bookService.getAll(userId);
  }

  @Post('isbn')
  async createFromIsbn(@Request() req, @Body() payload: BookIsbnDto) {
    const userId = req.user.id;
    return this.bookService.addByIsbn(
      userId,
      payload.isbn,
      payload.longitude,
      payload.latitude,
    );
  }

  @Post('manual')
  async createManually(@Request() req, @Body() payload: BookManualDto) {
    const userId = req.user.id;
    return this.bookService.addManual(userId, payload);
  }
}
