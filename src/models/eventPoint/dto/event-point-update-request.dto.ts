import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class EventPointUpdateRequestDto {
    @ApiProperty({
        example: 'SS180123',
        description: 'The updated studentID must be exist on this application'
    })
    studentID: string;

    @ApiProperty({
        example: 'Nguyen Cap Nhat'
    })
    studentName: string;

    @ApiProperty({
        example: 3
    })
    @IsNumber()
    @Type(() => Number)
    point: number;

    @ApiProperty({
        example: 'organizer'
    })
    role: string;
}