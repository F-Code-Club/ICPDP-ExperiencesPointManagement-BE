import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateClubRequestDto {
  @ApiProperty({
    example: 'test123',
    description: 'Username must be unique'
  })
  @IsNotEmpty()
  @MinLength(5, {
    message: 'This username is too short'
  })
  @MaxLength(20, {
    message: 'This username is too long',
  })
  username: string;

  @ApiProperty({
    example: 'test123@gmail.com',
    description: 'Email must be unique'
  }) 
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
   })
  @IsNotEmpty()
  @MinLength(6, {
    message: 'This password is too short',
   })
  @MaxLength(25, {
    message: 'This password is too long',
  })
  password: string;

  @ApiProperty({
    example: "club"
  })
  role: string;

  avatar?: string;

  @ApiProperty({
    example: 'F-Code'
  })
  @IsNotEmpty()
  name: string;
}
