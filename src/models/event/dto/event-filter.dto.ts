import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class EventFilterDto {
    @ApiProperty()
    @IsString()
    organization: string;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    year: number;

    @ApiProperty()
    @IsString()
    semester: string;

    @ApiPropertyOptional()
    orderBy?: string;

    @ApiPropertyOptional()    
    order?: string;

    @ApiPropertyOptional({
        default: ''
    })
    searchValue?: string;
}