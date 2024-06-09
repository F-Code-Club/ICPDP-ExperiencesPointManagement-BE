import { Expose } from "class-transformer";

export class DeptsResponseDto {
    @Expose()
    userID: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    role: string;

    @Expose()
    departmentID: string;

    @Expose()
    name: string;

    @Expose()
    avt: string;
}