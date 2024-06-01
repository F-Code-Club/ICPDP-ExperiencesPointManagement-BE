import { ApiProperty } from "@nestjs/swagger";
import { ResponseData } from "./response-data.dto";

export class ResponseRegisterUserDto {
    @ApiProperty({ type: ResponseData })
    data: ResponseData;

    @ApiProperty({
        example: 'Register successfully'
    })
    message: string;
}