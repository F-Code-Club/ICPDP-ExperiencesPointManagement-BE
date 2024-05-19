import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PointBoardDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    openAt: Date;

    @ApiProperty()
    @IsNotEmpty()
    closeAt: Date;
}