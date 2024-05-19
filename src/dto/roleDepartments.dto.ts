import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class RoleDepartmentsDto {
    @ApiProperty({
        example: 10,
    })
    @IsNotEmpty()
    @IsNumber()
    @Max(100)
    @Min(1)
    point: number;

    @ApiProperty({
        example: 'Vice President',
    })
    @IsNotEmpty()
    name: string;
}