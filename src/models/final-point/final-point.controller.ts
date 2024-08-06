import { BadRequestException, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { FinalPointService } from './final-point.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { FinalPointFilterDto } from './dto/final-point-filter.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';
import { FinalPointResponseDto } from './dto/final-point-response.dto';

@ApiTags('FinalPoint')
@Controller('final-point')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FinalPointController {
    constructor (
        private readonly finalPointService: FinalPointService,
    ) {};

    @Roles(Role.Admin)
    @Get('/:year&:semester')
    async getFinalPoints (@Param('year') year: number, @Param('semester') semester: string, @Query() filter: FinalPointFilterDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [finalPoints, count] = await this.finalPointService.getFinalPoints(filter, year, semester);
        let message = 'Get final points successfully';
        if (!finalPoints || count == 0) {  
            message = 'Get final points fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(finalPoints, FinalPointResponseDto), filter, count, message);
    }
}
