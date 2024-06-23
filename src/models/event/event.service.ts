import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from './event.entity';
import { Repository } from 'typeorm';
import { EventDto } from 'src/dto/event.dto';
import { ClbsService } from '../clbs/clbs.service';
import { DepartmentsService } from '../departments/departments.service';
import { Role } from 'src/enum/roles/role.enum';
import { SemestersService } from '../semesters/semesters.service';

@Injectable()
export class EventService {
    constructor (
        @InjectRepository(Events)
        private eventsRepository: Repository<Events>,
        private readonly clbsService: ClbsService,
        private readonly departmentSerivce: DepartmentsService,
        private readonly semesterSerivce: SemestersService,
    ) {};

    /*
    [POST]: /events
    */
    async createEvents (eventDto: EventDto, userRole: string, userID: string) {
        if (userRole === Role.Clb) {
            const checkClub = await this.clbsService.findByUserId(userID);
            if (!checkClub) {
                throw new ForbiddenException("You do not have right to create an event");
            }
            eventDto.club = checkClub;
            eventDto.department = null;
        } else if (userRole === Role.Dept) {
            const checkDepartment = await this.departmentSerivce.findByUserId(userID);
            if (!checkDepartment) {
                throw new ForbiddenException("You do not have right to create an event");
            }
            eventDto.department = checkDepartment;
            eventDto.club = null;
        }

        const checkValidYear = this.semesterSerivce.findByYear(eventDto.year);
        if (!checkValidYear) {
            throw new ForbiddenException("This semester year is not valid");
        }

        const newEvent = this.eventsRepository.create(eventDto);

        const saveEvent = await this.eventsRepository.save(newEvent);

        const responseData = {
            eventID: saveEvent.eventID,
            eventName: saveEvent.eventName,
            semester: saveEvent.semester,
            year: saveEvent.year,
        };

        return responseData;
    }
}
