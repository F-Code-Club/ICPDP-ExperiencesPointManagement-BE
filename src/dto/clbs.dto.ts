import { ApiProperty } from "@nestjs/swagger";

export class ClbsDto {
    @ApiProperty({
        example: 'F-Code'
    })
    name: string;

    avt?: string;

    userId?: string;
}