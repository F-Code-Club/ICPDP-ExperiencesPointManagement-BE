import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Clbs } from "src/models/clbs/clbs.entity";
import { Departments } from "src/models/departments/departments.entity";

export class EventDto {
    @ApiProperty({
        example: 'Đại hội'
    })
    @IsNotEmpty({
        message: 'Every event must have its own name'
    })
    eventName: string;

    @ApiProperty({
        example: 'spring'
    })
    @IsNotEmpty({
        message: 'Semester must not be empty'
    })
    semester: string;

    @ApiProperty({
        example: 2024
    })
    @IsNotEmpty({
        message: 'Year must not be empty'
    })
    year: number;

    club?: Clbs;

    department?: Departments;
}