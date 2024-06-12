import { Exclude, Expose, Type } from "class-transformer";

export class ClbsResponseDto {
    @Expose()
    userID: string;

    @Expose()
    username: string;

    @Expose()
    password: string;

    @Expose()
    email: string;

    @Expose()
    role: string;

    @Expose()
    clubID: string;

    @Expose()
    name: string;

    @Expose()
    avatar: string;

    @Exclude()
    createdAt?: Date;
}