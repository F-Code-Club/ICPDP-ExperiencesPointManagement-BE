import { Body, Controller, Param, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { EventPointService } from './event-point.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { EventPointCreateRequestDto } from './dto/event-point-create-request.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';

@ApiTags('EventPoint')
@Controller('eventpoint')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EventPointController {
    constructor (
        private readonly eventPointService: EventPointService,
    ) {};

    @Roles(Role.Clb, Role.Dept)
    @Post('/:ID')
    async addStudents (@Request() req, @Body() addStudentDto: EventPointCreateRequestDto, @Param('ID') id: string) {
        const responseData = await this.eventPointService.addStudents(id, addStudentDto, req.user.role, req.user.userID);
        return new ApiResponseDto(responseData, 'Add student successfully');
    }
}
