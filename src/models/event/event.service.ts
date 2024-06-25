import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from './event.entity';
import { Repository } from 'typeorm';
import { EventDto } from 'src/dto/event.dto';
import { ClbsService } from '../clbs/clbs.service';
import { DepartmentsService } from '../departments/departments.service';
import { Role } from 'src/enum/roles/role.enum';
import { SemestersService } from '../semesters/semesters.service';
import { EventUpdateRequestDto } from './dto/event-update-request.dto';
import { EventFilterDto } from './dto/event-filter.dto';

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
    [GET]: /events
    */
    async getAllEvents (dto: EventFilterDto, userRole: string, userId: string) {
        let responseData = await this.getByOrganization(dto.organization, dto.semester, dto.year);
        let organization = null;

        if (userRole === Role.Clb) {
            organization = await this.clbsService.findByUserId(userId);

            if (!organization || organization.clubID !== dto.organization) {
                throw new ForbiddenException('You do not have right to get event');
            }

        } else if (userRole === Role.Dept) {
            organization = await this.departmentSerivce.findByUserId(userId);

            if (!organization || organization.departmentID !== dto.organization) {
                throw new ForbiddenException('You do not have right to get event');
            }

        }

        // Remove ID and createdAt from responseData
        const formattedData = responseData.map(event => {
            const { createdAt, ...rest } = event;
            return rest;
        })

        return formattedData;
    }


    /*
    [POST]: /events
    */
    async createEvents (eventDto: EventDto, userRole: string, userID: string) {
        const checkDuplicate = await this.checkDuplicateEvent(eventDto.eventName, eventDto.semester, eventDto.year);

        if (checkDuplicate) {
            throw new ForbiddenException('This event is already exist in this semester');
        }

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

    /* 
    [PATCH]: /events/{ID}
    */
    async updateEvents (updateDto: EventUpdateRequestDto, id: string, userRole: string, userId: string) {
        const checkExistEventByEventID = await this.findById(id);

        let isChanged = false;

        if (!checkExistEventByEventID) {
            return null;
        }

        if (userRole === Role.Clb) {
            const checkClubByUserID = await this.clbsService.findByUserId(userId);

            if (!checkClubByUserID) {
                throw new ForbiddenException('You do not have right to edit this event');
            }

            if (checkExistEventByEventID.club && checkExistEventByEventID.club.clubID === checkClubByUserID.clubID) {
                if (updateDto.eventName && updateDto.eventName !== checkExistEventByEventID.eventName) {
                    checkExistEventByEventID.eventName = updateDto.eventName;
                    isChanged = true;
                }
            } else {
                throw new ForbiddenException('You do not have right to edit this event');
            }
        } else if (userRole === Role.Dept) {
            const checkDepartmentByUserID = await this.departmentSerivce.findByUserId(userId);

            if (!checkDepartmentByUserID) {
                throw new ForbiddenException('You do not have right to edit this event');
            }

            if (checkExistEventByEventID.department && checkExistEventByEventID.department.departmentID === checkDepartmentByUserID.departmentID) {
                if (updateDto.eventName && updateDto.eventName !== checkExistEventByEventID.eventName) {
                    checkExistEventByEventID.eventName = updateDto.eventName;
                    isChanged = true;
                }
            } else {
                throw new ForbiddenException('You do not have right to edit this event');
            }
        }

        if (!isChanged) {
            return 'Nothing changed';
        }

        const updatedEvent = await this.eventsRepository.save(checkExistEventByEventID);

        const responseData = {
            eventID: updatedEvent.eventID,
            eventName: updatedEvent.eventName,
            semester: updatedEvent.semester,
            year: updatedEvent.year,
        };

        return responseData;
    }

    /* 
    [DELETE]: /events/{ID}
    */
    async deleteEvents (id: string, userRole: string, userId: string) {
        const checkExistEvent = await this.findById(id);

        let deleteEvent = null;

        if (!checkExistEvent) {
            return null;
        }

        if (userRole === Role.Clb) {
            const checkClubByUserID = await this.clbsService.findByUserId(userId);

            if (!checkClubByUserID) {
                throw new ForbiddenException('You do not have right to delete this event');
            }

            if (checkExistEvent.club && checkExistEvent.club.clubID === checkClubByUserID.clubID) {
                deleteEvent = await this.eventsRepository.delete(id);
            } else {
                throw new ForbiddenException('You do not have right to delete this event');
            }
        } else if (userRole === Role.Dept) {
            const checkDepartmentByUserID = await this.departmentSerivce.findByUserId(userId);
            
            if (!checkDepartmentByUserID) {
                throw new ForbiddenException('You do not have right to delete this event');
            }

            if (checkExistEvent.department && checkExistEvent.department.departmentID === checkDepartmentByUserID.departmentID) {
                deleteEvent = await this.eventsRepository.delete(id);
            }
        }

        return deleteEvent.affected;
    }

    async findById (id: string) {
        const existEvent = await this.eventsRepository.findOne({
            where: {
                eventID: id,
            },
            relations: ['club', 'department']
        });
        return existEvent;
    }

    async checkDuplicateEvent (eventName: string, semester: string, year: number) {
        const existEvent = await this.eventsRepository.findOne({
            where: {
                eventName: eventName,
                semester: semester,
                year: year
            }
        });
        return existEvent;
    }

    async getByOrganization (organization: string, semester: string, year: number) {
        const existEvent = await this.eventsRepository.find({
            where: {
                semester: semester,
                year: year,
                club: {
                    clubID: organization
                }
            },
            order: { createdAt: 'ASC' }
        });
        return existEvent;
    }
}
