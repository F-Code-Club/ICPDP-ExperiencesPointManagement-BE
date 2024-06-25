import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Events } from "src/models/event/event.entity";
import { Students } from "src/models/students/students.entity";

export class EventPointCreateRequestDto {
    @ApiProperty({
        example: 'SE180123',
        description: "ID must follow the standards of FPT University's student code"
    })
    @IsNotEmpty()
    @MinLength(8, {
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
    studentName: string;

    @ApiProperty({
        example: 5
    })
    point: number;

    @ApiProperty({
        example: 'organizer'
    })
    role: string;

    student?: Students;

    event?: Events;
}