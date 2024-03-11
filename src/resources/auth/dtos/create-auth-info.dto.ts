import { IsNumber, IsString } from 'class-validator';

export class CreateAuthInfo {
  @IsNumber()
  userId: number;

  @IsString()
  accessToken: string;
}
