import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ClbsDto {
    @ApiProperty({
        example: 'F-Code'
    })
    @IsNotEmpty()
    name: string;

    avt?: string;
}