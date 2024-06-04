import { Expose } from "class-transformer";

export class ClbUsersResponseDto {
    @Expose()
    userId: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    role: string;
}