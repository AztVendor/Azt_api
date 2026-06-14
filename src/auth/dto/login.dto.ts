import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'Registered user email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234567890',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
