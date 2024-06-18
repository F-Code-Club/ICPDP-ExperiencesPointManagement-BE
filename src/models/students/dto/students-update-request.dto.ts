import { ApiProperty } from "@nestjs/swagger";

export class UpdateStudentRequestDto {
    @ApiProperty({
        example: 'Nguyen Cap Nhat'
    })
    name?: string;
}