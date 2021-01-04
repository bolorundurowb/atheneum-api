import { HttpModule, Module } from '@nestjs/common';
import { BooksService } from './services/books.service';
import { BooksController } from './books.controller';
import { IsbnService } from './services/isbn.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { Author, AuthorSchema } from './schemas/author.schema';
import { Publisher, PublisherSchema } from './schemas/publisher.schema';
import { UsersModule } from '../users/users.module';
import { PublishersController } from './publishers.controller';
import { PublisherService } from './services/publisher.service';
import { AuthorService } from './services/author.service';
import { AuthorsController } from './authors.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [BooksService, IsbnService, PublisherService, AuthorService],
  controllers: [BooksController, PublishersController, AuthorsController],
  imports: [
    AuthModule,
    HttpModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Publisher.name, schema: PublisherSchema },
    ]),
  ],
})
export class BooksModule {}
