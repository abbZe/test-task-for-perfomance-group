import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  password: string;
}
