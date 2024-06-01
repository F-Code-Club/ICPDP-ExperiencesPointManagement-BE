import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
    @ApiProperty()
    page: number;

    @ApiProperty()
    take: number;

    @ApiProperty()
    totalRecord: number;

    @ApiProperty()
    totalPage: number;

    @ApiProperty({ required: false })
    nextPage?: number;

    @ApiProperty({ required: false })
    prevPage?: number;
}