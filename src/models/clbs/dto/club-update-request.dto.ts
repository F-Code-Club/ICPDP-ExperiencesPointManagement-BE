import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean } from "class-validator";

export class UpdateClubRequestDto {
    @ApiProperty({
        example: 'F-Update'
    })
    name?: string;

    @ApiProperty({
        example: 'updatedname'
    })
    username?:string;

    @ApiProperty({
        example: 'emailupdate@gmail.com'
    })
    email?: string;

    @ApiProperty({
        example: 'updatepassword'
    })
    password?: string;

    avatar?: string;

    @ApiProperty({
        example: false
    })
    @IsBoolean()
    active?: boolean;
}