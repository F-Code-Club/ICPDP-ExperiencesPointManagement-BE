import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from '../event/event.entity';
import { Repository } from 'typeorm';
import { GetEventDashBoardAdmin } from './dto/event-dash-board-get-admin.dto';
import { Semesters } from '../semesters/semesters.entity';
import { SemestersService } from '../semesters/semesters.service';

@Injectable()
export class EventDashBoardService {
    constructor (
        @InjectRepository(Events)
        private eventRepository: Repository<Events>,
        @InjectRepository(Semesters)
        private semesterRepository: Repository<Semesters>,
        private readonly semesterService: SemestersService
    ) {};

    /*
    [GET]: /event-dash-board
    */
    async getAllEventForAdmin (dto: GetEventDashBoardAdmin) {
        if (dto.page < 1) {
            throw new ForbiddenException('page must be greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }

        const currentSemester = await this.semesterService.getCurrentSemester();

        if (!currentSemester) {
            throw new ForbiddenException('The current semester is not exist on this application');
        }

        return await this.eventRepository.createQueryBuilder('event')
            .leftJoinAndSelect('event.club', 'club')
            .leftJoinAndSelect('event.department', 'department')
            .where('event.semester = :semester', { semester: currentSemester.semester })
            .andWhere('event.year = :year', { year: currentSemester.year })
            .select([
                'event.eventID',
                'event.eventName',
                'event.semester',
                'event.year',
                'club.clubID',
                'club.name',
                'department.departmentID',
                'department.name'
            ])
            .orderBy('event.createdAt', 'ASC')
            .skip(dto.take * (dto.page - 1))
            .take(dto.take)
            .getManyAndCount();        
    }
}
