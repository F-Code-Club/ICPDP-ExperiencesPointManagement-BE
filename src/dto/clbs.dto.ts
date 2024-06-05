import { ApiProperty } from "@nestjs/swagger";
import { Users } from "src/models/users/users.entity";

export class ClbsDto {
    @ApiProperty({
        example: 'F-Code'
    })
    name: string;

    avt?: string;

    user?: Users;
}