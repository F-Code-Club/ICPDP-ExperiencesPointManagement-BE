import { BadRequestException, Body, Controller, Get, Param, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { EventPointService } from './event-point.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { EventPointCreateRequestDto } from './dto/event-point-create-request.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { EventPointFilterDto } from './dto/event-point-filter.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';
import { EventPointResponseDto } from './dto/event-point-response.dto';

@ApiTags('EventPoint')
@Controller('eventpoint')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EventPointController {
    constructor (
        private readonly eventPointService: EventPointService,
    ) {};

    @Get('/:ID')
    async getStudents (@Request() req, @Param('ID') id: string, @Query() filter: EventPointFilterDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [students, count] = await this.eventPointService.getStudents(filter, id, req.user.role, req.user.userID);
        let message = 'Get students successfully';
        if (!students || count == 0) {  
            message = 'Get students fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(students, EventPointResponseDto), filter, count, message);
    }

    @Roles(Role.Clb, Role.Dept)
    @Post('/:ID')
    async addStudents (@Request() req, @Body() addStudentDto: EventPointCreateRequestDto, @Param('ID') id: string) {
        const responseData = await this.eventPointService.addStudents(id, addStudentDto, req.user.role, req.user.userID);
        return new ApiResponseDto(responseData, 'Add student successfully');
    }
}
