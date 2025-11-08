import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Username for registration',
    example: 'johndoe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    description: 'Password for registration',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
