import { ApiProperty } from "@nestjs/swagger";

export class EventUpdateRequestDto {
    @ApiProperty({
        example: 'Update event name'
    })
    eventName: string;
}