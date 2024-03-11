import { MinLength, MaxLength, IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  email: string;

  @MinLength(3)
  @MaxLength(50)
  @IsString()
  password: string;
}
