/**
 * Created by bolorundurowb on 12/26/2020
 */
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  password: string;
}
