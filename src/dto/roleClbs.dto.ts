import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class RoleClbsDto {
    @ApiProperty({
        example: 'organizer',
    })
    @IsNotEmpty()
    role: string;

    @ApiProperty({
        example: 5,
    })
    @IsNotEmpty()
    @IsNumber()
    @Max(100)
    @Min(1)
    point: number;
}