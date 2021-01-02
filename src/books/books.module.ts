import { HttpModule, Module } from '@nestjs/common';
import { BooksService } from './services/books.service';
import { BooksController } from './books.controller';
import { IsbnService } from './services/isbn.service';

@Module({
  providers: [BooksService, IsbnService],
  controllers: [BooksController],
  imports: [HttpModule]
})
export class BooksModule {}
