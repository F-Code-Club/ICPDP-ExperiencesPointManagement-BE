import { Expose } from "class-transformer";

export class SemestersResponseDto {
    @Expose()
    semesterID: string;

    @Expose()
    semester: string;

    @Expose()
    year: number;

    @Expose()
    startDate: string;

    @Expose()
    endDate: string;
}