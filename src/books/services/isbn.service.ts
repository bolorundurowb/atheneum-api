/**
 * Created by bolorundurowb on 1/2/2021
 */

import { HttpService, Injectable, Logger } from '@nestjs/common';
import { BookInfoDto } from '../dtos/book-info.dto';

@Injectable()
export class IsbnService {
  private readonly baseUrl =
    'https://www.googleapis.com/books/v1/volumes?q=isbn:';
  private readonly logger = new Logger(IsbnService.name);

  constructor(private httpService: HttpService) {}

  async getBookByIsbn(isbn: string): Promise<BookInfoDto> {
    try {
      const response = await this.httpService
        .get<any>(`${this.baseUrl}${isbn}`)
        .toPromise();
      const data = response.data.items[0];

      if (!data) {
        return null;
      }

      const volInfo = data.volumeInfo;
      return {
        externalId: data.id,
        authors: volInfo.authors,
        publisher: volInfo.publisher,
        publishYear: +volInfo.publishedDate,
        summary: volInfo.description,
        title: volInfo.title,
        isbn: volInfo.industryIdentifiers.filter(
          (x) => x.type === 'ISBN_10',
        )[0],
        isbn13: volInfo.industryIdentifiers.filter(
          (x) => x.type === 'ISBN_13',
        )[0],
        coverArt: volInfo.imageLinks.thumbnail,
        pageCount: volInfo.pageCount,
      };
    } catch (err) {
      this.logger.error(
        'An error occurred when retrieving external book info.',
        err,
      );
      return null;
    }
  }
}
