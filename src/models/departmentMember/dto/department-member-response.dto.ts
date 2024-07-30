import { Expose } from "class-transformer";

export class DepartmentMemberResponseDto {
    @Expose()
    studentID: string;

    @Expose()
    studentName: string;
}