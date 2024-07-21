import { ApiProperty } from "@nestjs/swagger";
import { Students } from "src/models/students/students.entity";

export class AddClubMemberDto {
    @ApiProperty({
        example: 'SE180123'
    })
    studentID: string;

    students?: Students;
}