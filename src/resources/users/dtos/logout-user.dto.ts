import { IsNumber, Max, Min } from 'class-validator';

export class LogoutUserDto {
  @IsNumber()
  @Min(0)
  @Max(1000000)
  id: number;
}
