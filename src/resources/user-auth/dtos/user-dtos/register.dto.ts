import { MinLength, MaxLength, IsString } from 'class-validator';
import { LoginUserDto } from './login.dto';

export class RegisterUserDto extends LoginUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  repeatPassword: string;
}
