import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class EventDto {
    @ApiProperty({
        example: 'F-Code 10.1'
    })
    @IsNotEmpty()
    name: string;
}