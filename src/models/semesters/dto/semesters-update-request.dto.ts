import { ApiProperty } from "@nestjs/swagger";

export class SemestersUpdateRequestDto {
    @ApiProperty({
        example: '20/05/2024'
    })
    startDate: string;

    @ApiProperty({
        example: '01/06/2024'
    })
    endDate: string;
}