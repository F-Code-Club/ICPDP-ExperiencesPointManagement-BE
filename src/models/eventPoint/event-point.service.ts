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
import { relativeTimeThreshold } from 'moment';

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
    [POST]: /eventpoint
    */
    async addStudents (eventID, addStudentDto: EventPointCreateRequestDto, userRole: string, userId: string) {
        let createdStudents = null;

        const checkStudentID = await this.studentService.checkValidId(addStudentDto.studentID);
        if (!checkStudentID) {
            throw new ForbiddenException("ID must follow the standards of FPT University's student code");
        }

        const checkExistStudentOnThisEvent = await this.findByStudentID(addStudentDto.studentID);
        if (checkExistStudentOnThisEvent) {
            throw new ForbiddenException(`This student ${addStudentDto.studentID} is already exist on this event`);
        }

        const checkExistStudentOnSystem = await this.studentService.findByID(addStudentDto.studentID);
        if (!checkExistStudentOnSystem) {
            throw new ForbiddenException(`This student ${addStudentDto.studentID} is not exist on this application`);
        }
        addStudentDto.student = checkExistStudentOnSystem;

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

    async findByStudentID (studentID: string) {
        const existStudent = await this.eventPointRepository.findOne({
            where: {
                student: {
                    studentID: studentID,
                }
            }
        });
        return existStudent;
    }
}
