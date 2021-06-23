/**
 * Created by bolorundurowb on 6/19/2021
 */

import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import configuration from '../../config/configuration';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(configuration().sendgrid.apiKey);
  }

  public async send(
    recipient: string,
    subject: string,
    content: string,
    sender = 'atheneum@bolorundurowb.com',
    attachments: Array<any> = [],
  ) {
    const msg = {
      to: recipient,
      from: sender,
      subject: subject,
      html: content,
      attachments: attachments,
    };

    await sgMail.send(msg);
  }
}
