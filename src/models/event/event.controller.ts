import { Body, Controller, Param, Patch, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { EventService } from './event.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { EventDto } from 'src/dto/event.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { EventUpdateRequestDto } from './dto/event-update-request.dto';
import { Response } from 'express';

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

    @Roles(Role.Clb, Role.Dept)
    @Patch('/:ID')
    async updateEvents (@Request() req, @Body() eventUpdateDto: EventUpdateRequestDto, @Param('ID') id: string, @Res() res: Response) {
        const responseData = await this.eventsService.updateEvents(eventUpdateDto, id, req.user.role, req.user.userID);
        if (responseData === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        } else if (responseData === null) {
            return res.status(404).json(new ApiResponseDto(null, 'Event Not Found'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Update event successfully'));
        }
    }
}
