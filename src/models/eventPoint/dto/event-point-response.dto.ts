import { Expose } from "class-transformer";

export class EventPointResponseDto {
    @Expose()
    studentID: string;

    @Expose()
    studentName: string;

    @Expose()
    point: number;

    @Expose()
    role: string;
}