import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { EventDashBoardService } from './event-dash-board.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { GetEventDashBoardAdmin } from './dto/event-dash-board-get-admin.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';
import { GetAllEventAdminResponseDto } from './dto/event-dash-board-response-admin.dto';

@ApiTags('EventDashBoard')
@Controller('event-dash-board')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EventDashBoardController {
    constructor (
        private readonly eventDbService: EventDashBoardService
    ) {};

    @Roles(Role.Admin)
    @Get()
    async getAllEventForAdmin (@Query() filter: GetEventDashBoardAdmin) { 
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const result = await this.eventDbService.getAllEventForAdmin(filter);
        const {events, count} = result;
        let message = 'Get event dash board successfully';
        if (!events || count == 0) {
            message = 'Get event dash board fail';
        }   
    
        return PaginationDto.from(DtoMapper.mapMany(events, GetAllEventAdminResponseDto), filter, count, message);
    }
}
