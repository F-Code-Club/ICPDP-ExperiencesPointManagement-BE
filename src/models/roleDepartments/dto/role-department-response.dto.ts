import { Expose } from "class-transformer";

export class RoleDepartmentResponseDto {
    @Expose()
    roleClubID: string;

    @Expose()
    role: string;

    @Expose()
    point: string;
}