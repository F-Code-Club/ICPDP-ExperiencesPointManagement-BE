import { Expose, Type } from "class-transformer";

export class ClbsResponseDto {
    @Expose()
    userId: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    role: string;

    @Expose()
    clubId: string;

    @Expose()
    name: string;

    @Expose()
    avt: string;
}