/**
 * Created by bolorundurowb on 6/19/2021
 */

import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { CodeService } from './services/code.service';
import { TemplateService } from './services/template.service';

@Module({
  providers: [EmailService, CodeService, TemplateService],
  exports: [EmailService, CodeService, TemplateService],
})
export class SharedModule {}
