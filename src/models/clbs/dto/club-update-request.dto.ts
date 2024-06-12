import { ApiProperty } from "@nestjs/swagger"

export class UpdateClubRequestDto {
    @ApiProperty({
        example: 'F-Update'
    })
    name?: string;

    @ApiProperty({
        example: 'emailupdate@gmail.com'
    })
    email?: string;

    @ApiProperty({
        example: 'updatepassword'
    })
    password?: string;

    avatar?: string;
}