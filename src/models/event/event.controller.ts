import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { EventService } from './event.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { EventDto } from 'src/dto/event.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';

@ApiTags('Events')
@Controller('events')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EventController {
    constructor (
        private readonly eventsService: EventService,
    ) {};

    @Roles(Role.Clb, Role.Dept)
    @Post()
    async createEvents (@Request() req, @Body() eventDto: EventDto) {
        const responseData = await this.eventsService.createEvents(eventDto, req.user.role, req.user.userID);
        return new ApiResponseDto(responseData, 'Create event successfully');
    }   
}
