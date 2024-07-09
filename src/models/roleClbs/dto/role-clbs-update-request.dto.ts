import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoleClubDto {
    @ApiProperty({
        example: 'update role'
    })
    role: string;

    @ApiProperty({
        example: 9
    })
    point: number;
}