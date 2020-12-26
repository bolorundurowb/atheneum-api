/**
 * Created by bolorundurowb on 12/26/2020
 */

import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config({ silent: true });
  }

  getDbConnectionString(): string {
    return process.env.DB_URL;
  }
}
