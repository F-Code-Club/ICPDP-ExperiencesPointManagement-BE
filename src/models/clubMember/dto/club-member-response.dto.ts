import { Expose } from "class-transformer";

export class ClubMemberResponseDto {
    @Expose()
    studentID: string;

    @Expose()
    studentName: string;
}