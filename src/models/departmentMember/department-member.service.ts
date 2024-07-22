import { ForbiddenException, Injectable } from '@nestjs/common';
import { Departments } from '../departments/departments.entity';
import { Students } from '../students/students.entity';
import { StudentsService } from '../students/students.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddDepartmentMemberDto } from './dto/department-member-post-request.dto';

@Injectable()
export class DepartmentMemberService {
    constructor (
        @InjectRepository(Departments)
        private deptRepository: Repository<Departments>,
        @InjectRepository(Students)
        private studentRepository: Repository<Students>,
        private readonly studentService: StudentsService,
    ) {};

    /*
    [POST]: department-member
    */
    async addDepartmentMember(deptID: string, addMemberDto: AddDepartmentMemberDto) {
        // check valid of studentID
        const checkStudentID = await this.studentService.checkValidId(addMemberDto.studentID);
        if (!checkStudentID) {
            throw new ForbiddenException("ID must follow the standards of FPT University's student code");
        }

        // check if this studentID is exist on this department or not
        const checkExistStudentIDOnDept = await this.findByStudentID(deptID, addMemberDto.studentID);
        if (checkExistStudentIDOnDept) {
            throw new ForbiddenException(`This student ${addMemberDto.studentID} is already exist on this department`);
        }

        // check if this studentID is exist on this application or not
        const checkExistStudentOnSystem = await this.studentService.findByID(addMemberDto.studentID);
        if (!checkExistStudentOnSystem) {
            throw new ForbiddenException(`This student ${addMemberDto.studentID} is not exist on this application`);
        }
        addMemberDto.students = checkExistStudentOnSystem;

        const addMemberToDept = await this.deptRepository.findOne({
            where: {
                departmentID: deptID
            },
            relations: ['students']
        });

        if (!addMemberToDept.students) {
            addMemberToDept.students = [];
        }

        addMemberToDept.students.push(addMemberDto.students);

        await this.deptRepository.save(addMemberToDept);

        const responseData = {
            students: addMemberDto.students
        };
        return responseData;
    }

    async findByStudentID(deptID: string, studentID: string) {
        const exist = await this.deptRepository.findOne({
            where: {
                departmentID: deptID,
                students: {
                    studentID: studentID
                }
            }
        });
        return exist;
    }
}
