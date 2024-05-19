import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DepartmentsDto {
    @ApiProperty({
        example: 'Academic Deparment'
    })
    @IsNotEmpty()
    name: string;

    avt?: string;
}