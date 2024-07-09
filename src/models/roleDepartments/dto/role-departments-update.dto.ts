import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoleDepartmentDto {
    @ApiProperty({
        example: 'update role'
    })
    role: string;

    @ApiProperty({
        example: 10
    })
    point: number;
}