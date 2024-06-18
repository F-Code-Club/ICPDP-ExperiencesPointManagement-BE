import { Expose } from "class-transformer";

export class StudentsResponseDto {
    @Expose()
    studentID: string;

    @Expose()
    name: string;
}