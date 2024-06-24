import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class EventFilterDto {
    @ApiProperty()
    @IsString()
    organization: string;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    year: number;

    @ApiProperty()
    @IsString()
    semester: string;
}