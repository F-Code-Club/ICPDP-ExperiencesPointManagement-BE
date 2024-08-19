import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from '../event/event.entity';
import { CustomRepositoryNotFoundError, Repository } from 'typeorm';
import { GetEventDashBoardAdmin } from './dto/event-dash-board-get-admin.dto';
import { SemestersService } from '../semesters/semesters.service';
import { Clbs } from '../clbs/clbs.entity';
import { Departments } from '../departments/departments.entity';

@Injectable()
export class EventDashBoardService {
    constructor (
        @InjectRepository(Events)
        private eventRepository: Repository<Events>,
        @InjectRepository(Clbs)
        private clbRepository: Repository<Clbs>,
        @InjectRepository(Departments)
        private departmentRepository: Repository<Departments>,
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

        let clubs = [];
        let departments = [];
        let countClub: number, countDept: number;

        if (dto.take > 0) {
            [clubs, countClub] = await this.clbRepository.findAndCount({
                skip: dto.take * (dto.page - 1),
                take: dto.take,
            });
    
            // If slots available, take department
            if (clubs.length <= dto.take) {
                const remainingTake = dto.take - clubs.length;
                [departments, countDept] = await this.departmentRepository.findAndCount({
                    skip: (dto.page - 1) * dto.take,
                    take: remainingTake,
                });
                if (remainingTake === 0) {
                    departments = [];
                }
            }
        } else {
            [clubs, countClub] = await this.clbRepository.findAndCount();
            [departments, countDept] = await this.departmentRepository.findAndCount();
        }

        const organizations = await Promise.all([...clubs, ...departments].map(async (org) => {
            let events: Events[];
            let organizationID: string;            

            if ('clubID' in org) {
                organizationID = org.clubID;
                events = await this.eventRepository.find({
                    where: {
                        club: { clubID: org.clubID },
                        semester: currentSemester.semester,
                        year: currentSemester.year
                    }
                });
            } else if ('departmentID' in org) {
                organizationID = org.departmentID;
                events = await this.eventRepository.find({
                    where: {
                        department: { departmentID: org.departmentID },
                        semester: currentSemester.semester,
                        year: currentSemester.year
                    }
                });
            }

            const eventCount = events.length;
            const status = events.every(event => event.statusFillPoint);

            return {
                organizationID: organizationID,
                organizationName: org.name,
                eventCount,
                status
            };
        }));

        countClub = countClub ? countClub : 0;
        countDept = countDept ? countDept: 0;

        return {events: organizations, count: countClub + countDept};
    
    }
}
