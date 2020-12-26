/**
 * Created by bolorundurowb on 12/26/2020
 */
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  password: string;
}
