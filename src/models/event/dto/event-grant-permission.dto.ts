import { ApiProperty } from "@nestjs/swagger";
import { StatusPermission } from "../event.entity";

export class GrantPermissionDto {
    @ApiProperty({
        example: 'tao khong thich su kien nay'
    })
    note: string;

    @ApiProperty({
        example: StatusPermission.Denied,
        description: 'Gia tri cho status la approved, denied, pending'
    })
    status: StatusPermission;
}