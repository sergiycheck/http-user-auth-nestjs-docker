import { IsEmail, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetUserQuery {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100000)
  id?: number;

  @IsEmail()
  @IsOptional()
  email?: string;
}
