/**
 * Created by bolorundurowb on 1/2/2021
 */

import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsbnService {
  private readonly baseUrl = 'https://openlibrary.org/isbn/';
  private readonly querySuffix = '.json';

  constructor(private httpService: HttpService) {}

  getBookByIsbn(isbn: string): Observable<any> {
    return this.httpService.get(`${this.baseUrl}${isbn}${this.querySuffix}`);
  }
}
