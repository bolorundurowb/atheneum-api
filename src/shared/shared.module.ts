/**
 * Created by bolorundurowb on 6/19/2021
 */

import { HttpModule, Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { CodeService } from './services/code.service';
import { TemplateService } from './services/template.service';
import { IsbnService } from './services/isbn.service';

@Module({
  providers: [EmailService, CodeService, TemplateService, IsbnService],
  exports: [EmailService, CodeService, TemplateService, IsbnService],
  imports: [HttpModule]
})
export class SharedModule {}
