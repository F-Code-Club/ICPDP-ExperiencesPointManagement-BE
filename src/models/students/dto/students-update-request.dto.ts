import { ApiProperty } from "@nestjs/swagger";

export class UpdateStudentRequestDto {
    @ApiProperty({
        example: 'SE180321'
    })
    studentID?: string;

    @ApiProperty({
        example: 'Nguyen Cap Nhat'
    })
    name?: string;
}