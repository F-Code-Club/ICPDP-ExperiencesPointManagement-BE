import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SemesterDto {
    @ApiProperty({
        example: 'Summer',
    })
    @IsNotEmpty({
        message: 'Semester should not be empty'
    })
    semester: string;

    year?: number;

    @ApiProperty({
        example: '20/05/2024',
    })
    @IsNotEmpty({
        message: 'Start date should not be empty'
    })
    startDate: string;

    @ApiProperty({
        example: '12/08/2024',
    })
    @IsNotEmpty({
        message: 'End date should not be empty'
    })
    endDate: string;
}