import { ApiProperty } from "@nestjs/swagger";
import { Users } from "src/models/users/users.entity";

export class DepartmentsDto {
    @ApiProperty({
        example: 'IC-PDP'
    })
    name: string;

    avatar?: string;

    user?: Users;
}