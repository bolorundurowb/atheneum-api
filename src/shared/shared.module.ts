/**
 * Created by bolorundurowb on 6/19/2021
 */

import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { CodeService } from './services/code.service';

@Module({
  providers: [EmailService, CodeService],
  exports: [EmailService, CodeService],
})
export class SharedModule {}
