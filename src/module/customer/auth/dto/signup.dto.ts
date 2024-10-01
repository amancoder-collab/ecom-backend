import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: 'Enter the fullName of the user',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'enter the email of the user',
    example: 'testuser@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Enter the Password',
    example: '1234',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Enter the phoneNumber of the user',
    example: '7898000008',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Enter the birth date of the user',
    example: '2001-01-01',
    required: true,
  })
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    description: 'Enter the gender of the user',
    required: true,
    enum: Gender,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
