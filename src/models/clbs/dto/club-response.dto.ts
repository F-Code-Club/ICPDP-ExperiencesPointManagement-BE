import { Expose, Type } from "class-transformer";
import { ClbUsersResponseDto } from "./club-user-response.dto";

export class ClbsResponseDto {
    @Expose()
    clubId: string;

    @Expose()
    name: string;

    @Expose()
    avt: string;

    @Expose()
    @Type(() => ClbUsersResponseDto)
    user: ClbUsersResponseDto
}