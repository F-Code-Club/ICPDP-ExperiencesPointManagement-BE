import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { SemesterDto } from "src/dto/semester.dto";

export class CreateSemestersRequestDto {
    @ApiProperty({
        example: 2024,
    })
    @IsNotEmpty()
    year: number;

    @ApiProperty({
        type: [SemesterDto],
        description: 'Array of semesters',
        example: [
            {
                semester: "spring",
                startDate: "01/01/2024",
                endDate: "30/04/2024"
            },
            {
                semester: "summer",
                startDate: "20/05/2024",
                endDate: "12/08/2024"
            },
            {
                semester: "fall",
                startDate: "01/09/2024",
                endDate: "12/12/2024"
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SemesterDto)
    semesters: SemesterDto[];
}