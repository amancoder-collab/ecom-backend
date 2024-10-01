import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { emailRegExp } from 'src/common/types/reg.exp.types';

export class LoginDto {
  @ApiProperty({
    description: 'enter the email of the user',
    example: 'testuser@example.com',
    required: true,
  })
  @Matches(emailRegExp, {
    message: "'Email' must be a valid E-Mail Format.",
  })
  @IsNotEmpty({ message: 'email cannot be empty!' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Enter the Password',
    example: '1234',
    required: true,
  })
  @IsNotEmpty({ message: 'password felid cannot be empty!' })
  @IsString()
  password: string;
}
