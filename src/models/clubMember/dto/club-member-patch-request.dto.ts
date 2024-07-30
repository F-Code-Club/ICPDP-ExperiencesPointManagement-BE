import { ApiProperty } from "@nestjs/swagger";
import { Students } from "src/models/students/students.entity";

export class UpdateClubMemberDto {
    @ApiProperty({
        example: 'AI123123',
        description: 'The updated studentID must be exist on this application'
    })
    studentID: string;

    student?: Students;
}