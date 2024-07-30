import { ApiProperty } from "@nestjs/swagger";
import { Students } from "src/models/students/students.entity";

export class AddDepartmentMemberDto {
    @ApiProperty({
        example: 'SE180123'
    })
    studentID: string;

    students?: Students;
}