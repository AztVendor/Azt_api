import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'User last name',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: 'john@gmail.com',
    description: 'Unique email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
    description: 'Password stored as bcrypt hash',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: '+919876543210',
    description: 'Optional unique phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
