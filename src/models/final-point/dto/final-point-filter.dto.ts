import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { BaseFilterDto } from "src/utils/base-filter.dto";

export class FinalPointFilterDto extends BaseFilterDto {
    @ApiPropertyOptional()
    @IsOptional()
    orderBy?: string;

    @ApiPropertyOptional()    
    order?: string;

    @ApiPropertyOptional()
    searchValue?: string;
}