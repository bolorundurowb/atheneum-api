import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { IsbnService } from '../../shared/services/isbn.service';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from '../schemas/book.schema';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from '../schemas/author.schema';
import { Publisher, PublisherDocument } from '../schemas/publisher.schema';
import { UsersService } from '../../users/services/users.service';
import { BookManualDto } from '../dtos/book-manual.dto';
import { BookQueryDto } from '../dtos/book-query.dto';

@Injectable()
export class BooksService {
  constructor(
    private isbnService: IsbnService,
    private userService: UsersService,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    @InjectModel(Publisher.name)
    private publisherModel: Model<PublisherDocument>
  ) {}

  async getAll(ownerId: any, qm: BookQueryDto): Promise<Array<any>> {
    const query: any = {
      owner: ownerId
    };

    if (qm.search) {
      const caseInsensitiveSearch = {
        $regex: new RegExp(qm.search, 'i')
      };

      const orQueries: Array<any> = [
        { title: caseInsensitiveSearch },
        { summary: caseInsensitiveSearch },
        { isbn: caseInsensitiveSearch },
        { isbn13: caseInsensitiveSearch }
      ];

      // @ts-ignore
      if (!isNaN(qm.search)) {
        orQueries.push({
          publishYear: Number(qm.search)
        });
      }

      query.$or = orQueries;
    }

    if (qm.available !== undefined) {
      query.isAvailable = Boolean(qm.available);
    }

    return this.bookModel
      .find(query)
      .sort({ title: 'asc' })
      .populate('publisher', 'name')
      .populate('authors', 'name')
      .skip(Number(qm.skip || 0))
      .limit(Number(qm.limit || 30));
  }

  async getAllCount(ownerId: any): Promise<number> {
    return this.bookModel.countDocuments({ owner: ownerId });
  }

  async addByIsbn(ownerId: any, isbn: string): Promise<Book> {
    // find the owner
    const owner = await this.userService.findById(ownerId);

    if (!owner) {
      throw new UnauthorizedException();
    }

    // see if book exists
    let book = await this.bookModel.findOne({
      $and: [
        { owner: ownerId },
        {
          $or: [{ isbn: isbn }, { isbn13: isbn }]
        }
      ]
    });

    if (book) {
      throw new ConflictException(
        null,
        'Book with same ISBN exists in your library.'
      );
    }

    const bookInfo = await this.isbnService.getBookByIsbn(isbn);

    if (!bookInfo) {
      throw new NotFoundException(
        null,
        'Our sources do not have a book with the provided ISBN.'
      );
    }

    // find the publisher or create if they dont exist
    const publisherName = bookInfo.publisher || 'No Publisher';
    let publisher = await this.publisherModel.findOne({
      owner,
      name: {
        $regex: publisherName,
        $options: 'i'
      }
    });

    if (!publisher) {
      publisher = new this.publisherModel({
        owner,
        name: publisherName
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
          $options: 'i'
        }
      });

      if (!author) {
        author = new this.authorModel({
          owner,
          name: authorName
        });
        await author.save();
      }

      authors.push(author);
    }

    const model = Object.assign(bookInfo, {
      owner,
      authors: authors,
      publisher: publisher
    });

    book = new this.bookModel(model);
    return book.save();
  }

  async addManual(ownerId: any, details: BookManualDto): Promise<Book> {
    // find the owner
    const owner = await this.userService.findById(ownerId);

    if (!owner) {
      throw new UnauthorizedException();
    }

    // if an isbn is provided
    if (details.isbn) {
      const book = await this.bookModel.findOne({
        $and: [
          { owner: ownerId },
          {
            $or: [{ isbn: details.isbn }, { isbn13: details.isbn }]
          }
        ]
      });

      if (book) {
        throw new ConflictException(
          null,
          'Book with same ISBN exists in your library.'
        );
      }
    }

    // find the publisher or create if they dont exist
    const publisherName = details.publisher || 'No Publisher';
    let publisher = await this.publisherModel.findOne({
      owner,
      name: {
        $regex: publisherName,
        $options: 'i'
      }
    });

    if (!publisher) {
      publisher = new this.publisherModel({
        owner,
        name: publisherName
      });
      await publisher.save();
    }

    // find the authors and exit if they dont exist
    details.authors = details.authors || 'No Author';
    const authors = [];

    for (const authorName of details.authors.split(',')) {
      let author = await this.authorModel.findOne({
        owner,
        name: {
          $regex: authorName,
          $options: 'i'
        }
      });

      if (!author) {
        author = new this.authorModel({
          owner,
          name: authorName
        });
        await author.save();
      }

      authors.push(author);
    }

    const book = new this.bookModel(
      Object.assign(details, {
        summary: details.summary || details.title,
        isbn13: details.isbn,
        owner,
        authors,
        publisher
      })
    );
    return book.save();
  }

  async borrowBook(
    ownerId: any,
    bookId: string,
    borrowerName: string
  ): Promise<Book> {
    const book = await this.bookModel.findOne({
      owner: ownerId,
      _id: bookId
    });

    if (!book) {
      throw new NotFoundException(null, 'Book not found.');
    }

    if (!book.isAvailable) {
      throw new BadRequestException(null, 'Book is unavailable.');
    }

    if (!book.borrowingHistory) {
      book.borrowingHistory = [];
    }

    book.isAvailable = false;
    book.borrowingHistory.push({
      borrowedBy: borrowerName,
      borrowedAt: new Date()
    });
    await book.save();

    return book;
  }

  async returnBook(ownerId: any, bookId: string): Promise<Book> {
    const book = await this.bookModel.findOne({
      owner: ownerId,
      _id: bookId
    });

    if (!book) {
      throw new NotFoundException(null, 'Book not found.');
    }

    if (book.isAvailable) {
      throw new BadRequestException(
        null,
        'An available book cannot be returned.'
      );
    }

    if (!book.borrowingHistory) {
      throw new BadRequestException(null, 'Book has no borrowing history.');
    }

    const borrowRecord = book.borrowingHistory.filter((x) => !x.returnedAt)[0];

    if (borrowRecord) {
      borrowRecord.returnedAt = new Date();
      book.isAvailable = true;
      await book.save();
    }

    return book;
  }

  async getRecent(ownerId: any): Promise<Array<Book>> {
    return this.bookModel
      .find({
        owner: ownerId
      })
      .populate('authors', 'name')
      .populate('publisher', 'name')
      .sort({ createdAt: 'desc' })
      .limit(5);
  }

  async remove(ownerId: any, bookId: any): Promise<void> {
    await this.bookModel.findOneAndRemove({
      owner: ownerId,
      _id: bookId
    });
  }
}
