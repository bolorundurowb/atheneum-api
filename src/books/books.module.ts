import { HttpModule, Module } from '@nestjs/common';
import { BooksService } from './services/books.service';
import { BooksController } from './books.controller';
import { IsbnService } from './services/isbn.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { Author, AuthorSchema } from './schemas/author.schema';
import { Publisher, PublisherSchema } from './schemas/publisher.schema';

@Module({
  providers: [BooksService, IsbnService],
  controllers: [BooksController],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Publisher.name, schema: PublisherSchema },
    ]),
  ],
})
export class BooksModule {}
