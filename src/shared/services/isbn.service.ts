/**
 * Created by bolorundurowb on 1/2/2021
 */

import { HttpService, Injectable } from '@nestjs/common';
import { BookInfoDto } from '../../books/dtos/book-info.dto';
import { GoogleIsbnService } from './google-isbn.service';
import { OpenLibraryIsbnService } from './open-library-isbn.service';
import * as $ from 'cheerio';

@Injectable()
export class IsbnService {
  private readonly isbnSearchBaseUrl = 'https://www.google.com/search?q=';

  constructor(
    private googleIsbnService: GoogleIsbnService,
    private openLibIsbnService: OpenLibraryIsbnService,
    private httpService: HttpService
  ) {}

  async getBookByIsbn(isbn: string): Promise<BookInfoDto> {
    let book;

    // first try to use the open library
    book = await this.openLibIsbnService.search(isbn);

    // if book not found, try the google service
    if (!book) {
      book = await this.googleIsbnService.search(isbn);
    }

    return book;
  }

  async findIsbnByTitle(title: string): Promise<string> {
    const encodedTitle = encodeURI(title + ' isbn');
    const queryUrl = `${this.isbnSearchBaseUrl}${encodedTitle}`;
    console.log(title, encodedTitle, queryUrl);
    const response = await this.httpService.get<any>(queryUrl).toPromise();

return response.data;
  }
}
