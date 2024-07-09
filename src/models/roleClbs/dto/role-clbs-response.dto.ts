import { Expose } from "class-transformer";

export class RoleClubResponseDto {
    @Expose()
    roleClubID: string;

    @Expose()
    role: string;

    @Expose()
    point: string;
}