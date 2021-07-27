/**
 * Created by bolorundurowb on 7/27/2021
 */

import { HttpService, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import configuration from '../../config/configuration';

@Injectable()
export class SocialAuthService {
  private readonly googleClient = new OAuth2Client(
    configuration().google.clientId
  );

  constructor(private httpService: HttpService) {}

  async verifyFacebookToken(token): Promise<any> {
    const userRetrievalUrl = `https://graph.facebook.com/me?fields=id,first_name,last_name,email,gender&access_token=${token}`;
    const response = await this.httpService
      .get<any>(userRetrievalUrl)
      .toPromise();
    return response.data;
  }

  async verifyGoogleToken(token) {
    const response = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: configuration().google.clientId
    });

    return response.getPayload();
  }
}
