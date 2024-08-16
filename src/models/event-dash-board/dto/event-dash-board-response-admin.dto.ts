import { Expose } from "class-transformer";

export class GetAllEventAdminResponseDto {
    @Expose()
    organizationID: string;

    @Expose()
    organizationName: string;

    @Expose()
    totalEvent: number;
}