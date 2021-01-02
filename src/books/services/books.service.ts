import { HttpService, Injectable, Logger } from '@nestjs/common';
import { IsbnService } from './isbn.service';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(private isbnService: IsbnService) {
  }


}
