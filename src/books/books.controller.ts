import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BooksService } from './services/books.service';
import { BookIsbnDto } from './dtos/book-isbn.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Post('isbn')
  async createFromIsbn(@Request() req, @Body() payload: BookIsbnDto) {
    const userId = req.user.id;
    return this.bookService.addByIsbn(userId, payload.isbn);
  }
}
