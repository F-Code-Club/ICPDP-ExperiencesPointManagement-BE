import { ApiProperty } from "@nestjs/swagger";
import { Students } from "src/models/students/students.entity";

export class ClubMemberDto {
    @ApiProperty({
        example: 'Your club ID'
    })
    clubID: string;

    @ApiProperty({
        example: 'SE180123'
    })
    studentID: string;

    students?: Students;
}