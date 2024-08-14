import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from '../event/event.entity';
import { Repository } from 'typeorm';
import { GetEventDashBoardAdmin } from './dto/event-dash-board-get-admin.dto';

@Injectable()
export class EventDashBoardService {
    constructor (
        @InjectRepository(Events)
        private eventRepository: Repository<Events>
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

        return await this.eventRepository.createQueryBuilder('event')
            .leftJoinAndSelect('event.club', 'club')
            .leftJoinAndSelect('event.department', 'department')
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
