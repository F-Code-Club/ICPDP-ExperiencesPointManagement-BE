import { ApiProperty } from "@nestjs/swagger";

export class ResponseData {
    @ApiProperty({
        example: 'test123'
    })
    username: string;

    @ApiProperty({
        example: 'user'
    })
    role: string;
}