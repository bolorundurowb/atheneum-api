import {
  ConflictException,
  Injectable,
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
import { BookManualDto } from '../dtos/book-manual.dto';

@Injectable()
export class BooksService {
  constructor(
    private isbnService: IsbnService,
    private userService: UsersService,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    @InjectModel(Publisher.name)
    private publisherModel: Model<PublisherDocument>,
  ) {}

  async getAll(ownerId: any): Promise<Array<any>> {
    return this.bookModel
      .find({
        owner: ownerId,
      })
      .sort({ title: 'asc' });
  }

  async addByIsbn(
    ownerId: string,
    isbn: string,
    longitude?: number,
    latitude?: number,
  ): Promise<Book> {
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
      owner,
      name: {
        $regex: bookInfo.publisher,
        $options: 'i',
      },
    });

    if (!publisher) {
      publisher = new this.publisherModel({
        owner,
        name: bookInfo.publisher,
      });
      await publisher.save();
    }

    // find the authors or create if they dont exist
    const authors = [];

    for (const authorName of bookInfo.authors) {
      let author = await this.authorModel.findOne({
        owner,
        name: {
          $regex: authorName,
          $options: 'i',
        },
      });

      if (!author) {
        author = new this.authorModel({
          owner,
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

    book = new this.bookModel(
      Object.assign(bookInfo, {
        owner,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      }),
    );
    return book.save();
  }

  async addManual(ownerId: string, details: BookManualDto): Promise<Book> {
    // find the owner
    const owner = await this.userService.findById(ownerId);

    if (!owner) {
      throw new UnauthorizedException();
    }

    // find the publisher and exit if they dont exist
    const publisher = await this.publisherModel.findById(details.publisherId);

    if (!publisher) {
      throw new NotFoundException(null, 'Publisher was not found.');
    }

    // find the authors and exit if they dont exist
    const authors = [];

    for (const authorId of details.authorIds) {
      const author = await this.authorModel.findById(authorId);

      if (author) {
        authors.push(author);
      }
    }

    if (authors.length <= 0) {
      throw new NotFoundException(null, 'No authors found.');
    }

    // see if book exists
    let book = await this.bookModel.findOne({
      $and: [
        {
          title: {
            $regex: details.title,
            $options: 'i',
          },
        },
        {
          $or: [
            { isbn: details.isbn },
            { isbn: details.isbn13 },
            { isbn13: details.isbn },
            { isbn13: details.isbn13 },
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

    book = new this.bookModel(
      Object.assign(details, {
        owner,
        authors,
        publisher,
        location: {
          type: 'Point',
          coordinates: [details.longitude, details.latitude],
        },
      }),
    );
    return book.save();
  }
}
