import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class StudentsDto {
    @ApiProperty({
        example: 'SE180123',
        description: "ID must follow the standards of FPT University's student code"
    })
    @IsNotEmpty()
    @MinLength(7, {
        message: 'This id is not valid'
    })
    @MaxLength(8, {
        message: 'This id is not valid'
    })
    studentID: string;

    @ApiProperty({
        example: 'Nguyen Van A'
    })
    @IsNotEmpty()
    name: string;
}