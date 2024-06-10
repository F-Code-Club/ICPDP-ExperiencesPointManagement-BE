import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty({
        example: 'password123'
    })
    oldPassword: string;

    @ApiProperty({
        example: '123123'
    })
    @IsNotEmpty()
    @MinLength(6, {
    message: 'This password is too short',
    })
    @MaxLength(25, {
    message: 'This password is too long',
    })
    newPassword: string;
}