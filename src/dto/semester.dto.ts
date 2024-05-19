import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Max, Min } from "class-validator";

export class SemesterDto {
    @ApiProperty({
        example: 'Summer2024',
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 2024,
    })
    @IsNotEmpty()
    @Min(2006, {
        message: 'FPT HCM is not exist before 2006',
    })
    @Max(2030, {
        message: 'This year is too far',
    })
    year: number;
}