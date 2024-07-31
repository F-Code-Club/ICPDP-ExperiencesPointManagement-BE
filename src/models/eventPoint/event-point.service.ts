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
import { EventPointUpdateRequestDto } from './dto/event-point-update-request.dto';
import { RoleClbsService } from '../roleClbs/role-clbs.service';
import { RoleDepartmentsService } from '../roleDepartments/role-departments.service';
import { ClubMemberService } from '../clubMember/club-member.service';
import { DepartmentMemberService } from '../departmentMember/department-member.service';

@Injectable()
export class EventPointService {
    constructor (
        @InjectRepository(EventPoint)
        private eventPointRepository: Repository<EventPoint>,
        private readonly eventService: EventService,
        private readonly departmentSerivce: DepartmentsService,
        private readonly clubService: ClbsService,
        private readonly studentService: StudentsService,
        private readonly roleClubService: RoleClbsService,
        private readonly roleDepartmentService: RoleDepartmentsService,
        private readonly clubMemberService: ClubMemberService,
        private readonly deptMemberService: DepartmentMemberService,
    ) {};

    /* 
    [GET]: /eventpoint/{eventID}
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

        const checkRoleForGetStudent = await this.checkRole(eventID, userRole, userID);
        if (!checkRoleForGetStudent) {
            throw new ForbiddenException('You do not have right to get student on this event');
        }

        return await this.eventPointRepository.findAndCount({
            relations: ['event', 'student'],
            take: dto.take,
            skip: dto.take*(dto.page - 1),
            where: {
                event: {
                    eventID: checkEvent.eventID
                }
            },
            order: {
                createdAt: 'ASC'
            }
        });
    }

    /* 
    [POST]: /eventpoint/{eventID}
    */
    async addStudents (eventID: string, addStudentDto: EventPointCreateRequestDto, userRole: string, userId: string, organizationID: string) {

        // check valid of studentID
        const checkStudentID = await this.studentService.checkValidId(addStudentDto.studentID);
        if (!checkStudentID) {
            throw new ForbiddenException("ID must follow the standards of FPT University's student code");
        }

        // check if this studentID is exist on organization
        await this.checkStudentOnOrganization(organizationID, userRole, addStudentDto.studentID);
        
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

        const checkRoleForAddStudents = await this.checkRole(eventID, userRole, userId);
        if (!checkRoleForAddStudents) {
            throw new ForbiddenException('You do not have right to add students on this event');
        }

        // check the role of that student in the event to take the point
        let checkRole = null;
        if (userRole === Role.Clb) {
            checkRole = await this.roleClubService.findByName(addStudentDto.role);
            if (!checkRole) {
                throw new ForbiddenException(`This role ${addStudentDto.role} is not valid`);
            }
            addStudentDto.point = checkRole.point;
        } else if (userRole === Role.Dept) {
            checkRole = await this.roleDepartmentService.findByName(addStudentDto.role);
            if (!checkRole) {
                throw new ForbiddenException(`This role ${addStudentDto.role} is not valid`);
            }
            addStudentDto.point = checkRole.point;
        }

        const createdStudents = this.eventPointRepository.create(addStudentDto);


        const newStudent = await this.eventPointRepository.save(createdStudents);

        const responseData = {
            studentID: newStudent.student.studentID,
            studentName: newStudent.student.name,
            point: newStudent.point,
            role: newStudent.role
        };

        return responseData;
    }

    /*
    [PATCH]: /eventpoint/{eventID&studentID}
    */
    async updateStudents (eventID: string, studentIDFromParam: string, updateDto: EventPointUpdateRequestDto, userRole: string, userId: string, organizationID: string) {
        const checkRoleForUpdate = await this.checkRole(eventID, userRole, userId);
        if (!checkRoleForUpdate) {
            throw new ForbiddenException('You do not have right to update student on this event');
        }

        let isChanged = false;
        // update start here
        const checkUpStudentEventPoint = await this.findByStudentIDnEventID(eventID, studentIDFromParam);
        if (!checkUpStudentEventPoint) {
            throw new ForbiddenException('This event or this student is not valid');
        }

        // check if the studentIDFromParam is exist on organization or not
        await this.checkStudentOnOrganization(organizationID, userRole, studentIDFromParam);

        // update studentID
        if (updateDto.studentID && updateDto.studentID !== studentIDFromParam) {
            const checkValidUpStudentID = await this.studentService.checkValidId(updateDto.studentID);
            if (!checkValidUpStudentID) {
                throw new ForbiddenException(`This studentID ${updateDto.studentID} is not valid`);
            }   
            
            const checkExistUpdateStudentID = await this.studentService.findByID(updateDto.studentID);
            if (!checkExistUpdateStudentID) {
                throw new ForbiddenException(`This new studentID ${updateDto.studentID} is not exist on this application`);
            }

            const checkExistUpdateStudentIDonEvent = await this.findByStudentIDnEventID(eventID, updateDto.studentID);
            if (checkExistUpdateStudentIDonEvent) {
                throw new ForbiddenException(`This new studentID ${updateDto.studentID} is already exist on this event`);
            }

            checkUpStudentEventPoint.student.studentID = updateDto.studentID;
            isChanged = true;
        }
        
        // update point
        if (updateDto.point && updateDto.point !== checkUpStudentEventPoint.point) {
            checkUpStudentEventPoint.point = updateDto.point;
            isChanged = true;
        }

        // update role
        if (updateDto.role && updateDto.role !== checkUpStudentEventPoint.role) {
            checkUpStudentEventPoint.role = updateDto.role;
            isChanged = true;
        }

        if (!isChanged) {
            return 'Nothing changed';
        }

        const updatedStudentOnEventPoint = await this.eventPointRepository.save(checkUpStudentEventPoint);

        const responseData = {
            studentID: updatedStudentOnEventPoint.student.studentID,
            studentName: updatedStudentOnEventPoint.student.name,
            point: updatedStudentOnEventPoint.point,
            role: updatedStudentOnEventPoint.role
        };

        return responseData;
    }   

    /* 
    [DELETE]: /eventpoint/{eventID&studentID}
    */
    async deleteStudents (eventID: string, studentID: string, userRole: string, userId: string) {
        const checkRoleForDelete = await this.checkRole(eventID, userRole, userId);
        if (!checkRoleForDelete) {
            throw new ForbiddenException('You do not have right to delete students on this event');
        }        

        const checkEvent = await this.eventService.findById(eventID);
        if (!checkEvent) {
            throw new ForbiddenException('This event is not exist');
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

    async checkRole (eventID: string, userRole: string, userID: string) {
        const checkEvent = await this.eventService.findById(eventID);
        if (!checkEvent) {
            throw new ForbiddenException('This event is not exist');
        }        

        let checkOrganization = null;

        if (userRole === Role.Clb) {
            checkOrganization = await this.clubService.findByUserId(userID);

            if (!checkOrganization || checkEvent.club === null || checkEvent.club.clubID !== checkOrganization.clubID) {
                throw new ForbiddenException('You do not have right on this event');
            }

            
        } else if (userRole === Role.Dept) {
            checkOrganization = await this.departmentSerivce.findByUserId(userID);

            if (!checkOrganization || checkEvent.department === null || checkEvent.department.departmentID !== checkOrganization.departmentID) {
                throw new ForbiddenException('You do not have right on this event');
            }
        }
        return true;
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

    async checkStudentOnOrganization (organizationID: string, userRole: string, studentID: string) {
        if (userRole === Role.Clb) {
            const isExist = await this.clubMemberService.findByStudentID(organizationID, studentID);
            if (!isExist) {
                throw new ForbiddenException(`This studentID ${studentID} is not exist on your club`);
            }
        } else if (userRole === Role.Dept) {
            const isExist = await this.deptMemberService.findByStudentID(organizationID, studentID);
            if (!isExist) {
                throw new ForbiddenException(`This studentID ${studentID} is not exist on your department`);
            }
        }
        return true;
    }
}
