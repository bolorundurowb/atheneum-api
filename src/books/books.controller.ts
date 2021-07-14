import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BooksService } from './services/books.service';
import { BookIsbnDto } from './dtos/book-isbn.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookManualDto } from './dtos/book-manual.dto';
import { BookQueryDto } from './dtos/book-query.dto';
import { BorrowBookDto } from './dtos/borrow-book.dto';

@ApiTags('Books')
@UseGuards(JwtAuthGuard)
@Controller('v1/books')
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Get('')
  async getAll(@Request() req, @Query() qm: BookQueryDto) {
    const userId = req.user.id;
    return this.bookService.getAll(userId, qm);
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

  @Post(':bookId/borrow')
  async borrowBook(
    @Request() req,
    @Param('bookId') bookId: string,
    @Body() payload: BorrowBookDto,
  ) {
    const userId = req.user.id;
    return this.bookService.borrowBook(userId, bookId, payload.borrowerName);
  }

  @Post(':bookId/return')
  async returnBook(
    @Request() req,
    @Param('bookId') bookId: string,
  ) {
    const userId = req.user.id;
    return this.bookService.returnBook(userId, bookId);
  }
}
