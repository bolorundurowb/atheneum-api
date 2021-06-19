/**
 * Created by bolorundurowb on 6/19/2021
 */

import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class SharedModule {
}
