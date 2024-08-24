import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseFilterDto } from "src/utils/base-filter.dto";

export class StudentsFilterDto extends BaseFilterDto {
    @ApiPropertyOptional()
    orderBy?: string;

    @ApiPropertyOptional()    
    order?: string;

    @ApiPropertyOptional({
        default: ''
    })
    searchValue?: string;
}