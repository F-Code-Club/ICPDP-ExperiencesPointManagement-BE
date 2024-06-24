import { Expose } from "class-transformer";

export class EventResponseDto {
    @Expose()
    eventID: string;

    @Expose()
    eventName: string;

    @Expose()
    semester: string;

    @Expose()
    year: number;

    @Expose()
    clubName: string;

    @Expose()
    departmentName: string;
}