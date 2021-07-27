/**
 * Created by bolorundurowb on 7/27/2021
 */
  
import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export  class SocialAuthService {
  constructor(private httpService: HttpService) {
  }
}
