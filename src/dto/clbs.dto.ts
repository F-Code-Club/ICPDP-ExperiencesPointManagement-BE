import { ApiProperty } from "@nestjs/swagger";

export class ClbsDto {
    @ApiProperty({
        example: 'F-Code'
    })
    name: string;

    avt?: string;

    @ApiProperty({
        example: '4269e440-fd43-4c8c-b227-1d769bdea093'
    })
    userId: string;
}