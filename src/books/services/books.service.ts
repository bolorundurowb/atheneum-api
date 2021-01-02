import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IsbnService } from './isbn.service';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(private isbnService: IsbnService) {
  }

  async addByIsbn(isbn: string): Promise<any> {
    const bookInfo = await this.isbnService.getBookByIsbn(isbn);

    if (!bookInfo) {
      throw new NotFoundException(null, 'A book with the provided ISBN does not exist.');
    }

// const book =
  }
}
