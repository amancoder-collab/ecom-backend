import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNumber, IsString, Matches } from 'class-validator';
import { emailRegExp } from 'src/common/types/reg.exp.types';

export class SubEmailDto {
    @ApiProperty({
        description: 'Enter the email',
        example: 'example12@gmail.com',
        required: true,
    })
    @IsEmail()
    @Matches(emailRegExp, {
        message: "'Email' must be a valid E-Mail Format.",
    })
    email: string;
}
