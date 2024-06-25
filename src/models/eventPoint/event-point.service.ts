import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventPoint } from './event-point.entity';
import { Repository } from 'typeorm';
import { EventPointCreateRequestDto } from './dto/event-point-create-request.dto';
import { EventService } from '../event/event.service';
import { DepartmentsService } from '../departments/departments.service';
import { Role } from 'src/enum/roles/role.enum';
import { ClbsService } from '../clbs/clbs.service';
import { StudentsService } from '../students/students.service';
import { EventPointFilterDto } from './dto/event-point-filter.dto';

@Injectable()
export class EventPointService {
    constructor (
        @InjectRepository(EventPoint)
        private eventPointRepository: Repository<EventPoint>,
        private readonly eventService: EventService,
        private readonly departmentSerivce: DepartmentsService,
        private readonly clubService: ClbsService,
        private readonly studentService: StudentsService,
    ) {};

    /* 
    [GET]: /eventpoint/{ID}
    */
    async getStudents(dto: EventPointFilterDto, eventID: string, userRole: string, userID: string) {
        if (dto.page < 1) {
            throw new ForbiddenException('page must greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }

        const checkEvent = await this.eventService.findById(eventID);
        if (!checkEvent) {
            throw new ForbiddenException('This event is not exist');
        }        

        let checkOrganization = null;

        if (userRole === Role.Clb) {
            checkOrganization = await this.clubService.findByUserId(userID);

            if (!checkOrganization || checkEvent.club === null || checkEvent.club.clubID !== checkOrganization.clubID) {
                throw new ForbiddenException('You do not have right to get students on this event');
            }

            
        } else if (userRole === Role.Dept) {
            checkOrganization = await this.departmentSerivce.findByUserId(userID);

            if (!checkOrganization || checkEvent.department === null || checkEvent.department.departmentID !== checkOrganization.departmentID) {
                throw new ForbiddenException('You do not have right to get students on this event');
            }
        }

        return await this.eventPointRepository.findAndCount({
            relations: ['event', 'student'],
            take: dto.take,
            skip: dto.take*(dto.page - 1),
            where: {
                event: {
                    eventID: checkEvent.eventID
                }
            }
        });
    }

    /* 
    [POST]: /eventpoint/{ID}
    */
    async addStudents (eventID: string, addStudentDto: EventPointCreateRequestDto, userRole: string, userId: string) {
        let createdStudents = null;

        // check valid of studentID
        const checkStudentID = await this.studentService.checkValidId(addStudentDto.studentID);
        if (!checkStudentID) {
            throw new ForbiddenException("ID must follow the standards of FPT University's student code");
        }

        // check if this studentID is exist on this eventID or not
        const checkExistStudentOnThisEvent = await this.findByStudentIDnEventID(eventID, addStudentDto.studentID);
        if (checkExistStudentOnThisEvent) {
            throw new ForbiddenException(`This student ${addStudentDto.studentID} is already exist on this event`);
        }

        // check if this studentID is exist on this application or not
        const checkExistStudentOnSystem = await this.studentService.findByID(addStudentDto.studentID);
        if (!checkExistStudentOnSystem) {
            throw new ForbiddenException(`This student ${addStudentDto.studentID} is not exist on this application`);
        }
        addStudentDto.student = checkExistStudentOnSystem;

        // check if this eventID is exist or not
        const checkEvent = await this.eventService.findById(eventID);
        if (!checkEvent) {
            throw new ForbiddenException('This event is not exist');
        }
        addStudentDto.event = checkEvent;

        let checkOrganization = null;

        if (userRole === Role.Clb) {
            checkOrganization = await this.clubService.findByUserId(userId);

            if (!checkOrganization || checkEvent.club === null || checkEvent.club.clubID !== checkOrganization.clubID) {
                throw new ForbiddenException('You do not have right to add students to this event');
            }

            createdStudents = this.eventPointRepository.create(addStudentDto);
        } else if (userRole === Role.Dept) {
            checkOrganization = await this.departmentSerivce.findByUserId(userId);

            if (!checkOrganization || checkEvent.department === null || checkEvent.department.departmentID !== checkOrganization.departmentID) {
                throw new ForbiddenException('You do not have right to add students to this event');
            }

            createdStudents = this.eventPointRepository.create(addStudentDto);
        }

        const newStudent = await this.eventPointRepository.save(createdStudents);

        const responseData = {
            studentID: newStudent.student.studentID,
            studentName: newStudent.studentName,
            point: newStudent.point,
            role: newStudent.role
        };

        return responseData;
    }

    /* 
    [DELETE]: /eventpoint/{ID}
    */
    async deleteStudents (eventID: string, studentID: string, userRole: string, userId: string) {
        let checkOrganization = null;

        // check if event is exist or not
        const checkEvent = await this.eventService.findById(eventID);
        if (!checkEvent) {
            throw new ForbiddenException('This event is not exist');
        }

        if (userRole === Role.Clb) {
            checkOrganization = await this.clubService.findByUserId(userId);

            if (!checkOrganization || checkEvent.club === null || checkEvent.club.clubID !== checkOrganization.clubID) {
                throw new ForbiddenException('You do not have right to delete students to this event');
            }
        } else if (userRole === Role.Dept) {
            checkOrganization = await this.departmentSerivce.findByUserId(userId);

            if (!checkOrganization || checkEvent.department === null || checkEvent.department.departmentID !== checkOrganization.departmentID) {
                throw new ForbiddenException('You do not have right to delete students to this event');
            }   
        }

        const checkDelEvent = await this.findByStudentIDnEventID(eventID, studentID);
        if (!checkDelEvent) {
            throw new ForbiddenException('This event or this student is not valid');
        }
        
        if (checkEvent.eventID !== checkDelEvent.event.eventID) {
            throw new ForbiddenException('This event is not valid');
        }

        const res = await this.eventPointRepository.delete(checkDelEvent.id);
        return res.affected;
    }

    async findByStudentIDnEventID (eventID: string, studentID: string) {
        const exist = await this.eventPointRepository.findOne({
            where: {
                student: {
                    studentID: studentID
                },
                event: {
                    eventID: eventID
                }
            },
            relations: ['student', 'event']
        });
        return exist;
    }
}
