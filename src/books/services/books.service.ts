import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IsbnService } from './isbn.service';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from '../schemas/book.schema';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from '../schemas/author.schema';
import { Publisher, PublisherDocument } from '../schemas/publisher.schema';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    private isbnService: IsbnService,
    private userService: UsersService,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    @InjectModel(Publisher.name)
    private publisherModel: Model<PublisherDocument>,
  ) {}

  async addByIsbn(ownerId: string, isbn: string): Promise<Book> {
    // find the owner
    const owner = await this.userService.findById(ownerId);

    if (!owner) {
      throw new UnauthorizedException();
    }

    const bookInfo = await this.isbnService.getBookByIsbn(isbn);

    if (!bookInfo) {
      throw new NotFoundException(
        null,
        'A book with the provided ISBN does not exist.',
      );
    }

    // find the publisher or create if they dont exist
    let publisher = await this.publisherModel.findOne({
      name: {
        $regex: bookInfo.publisher,
        $options: 'i',
      },
    });

    if (!publisher) {
      publisher = new this.publisherModel({
        name: bookInfo.publisher,
      });
      await publisher.save();
    }

    // find the authors or create if they dont exist
    const authors = [];

    for (const authorName of bookInfo.authors) {
      let author = await this.authorModel.findOne({
        name: {
          $regex: authorName,
          $options: 'i',
        },
      });

      if (!author) {
        author = new this.authorModel({
          name: authorName,
        });
        await author.save();
      }

      authors.push(author);
    }

    // see if book exists
    let book = await this.bookModel.findOne({
      $and: [
        {
          title: {
            $regex: bookInfo.title,
            $options: 'i',
          },
        },
        {
          $or: [
            { isbn: bookInfo.isbn },
            { isbn: bookInfo.isbn13 },
            { isbn13: bookInfo.isbn },
            { isbn13: bookInfo.isbn13 },
          ],
        },
      ],
    });

    if (book) {
      throw new ConflictException(
        null,
        'Book with same title and ISBN exists.',
      );
    }

    book = new this.bookModel(Object.assign(bookInfo, { owner }));
    return book.save();
  }
}
