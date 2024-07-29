import { ForbiddenException, Injectable } from '@nestjs/common';
import { Departments } from '../departments/departments.entity';
import { Students } from '../students/students.entity';
import { StudentsService } from '../students/students.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddDepartmentMemberDto } from './dto/department-member-post-request.dto';
import { updateDepartmentMemberDto } from './dto/department-member-patch-request.dto';
import { GetDepartmentMemberDto } from './dto/department-member-get-request.dto';

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
    [GET]: department-member
    */
    async getDepartmentMember(departmentID: string, dto: GetDepartmentMemberDto): Promise<[Students[], number]> {
        if (dto.page < 1) {
            throw new ForbiddenException('page must greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }

        const queryBuilder = this.studentRepository.createQueryBuilder('student')
            .innerJoin('departmentmember', 'dm', 'dm.studentID = student.studentID')
            .where('dm.departmentID = :departmentID', { departmentID })
            .skip(dto.take * (dto.page - 1))
            .take(dto.take);

        const [students, total] = await queryBuilder.getManyAndCount();

        return [students, total];
    }

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

    /*
    [PATCH]: department-member/{studentID}
    */
    async updateDepartmentMember(departmentID: string, updateDto: updateDepartmentMemberDto, studentIDFromParam: string) {
        const updateDepartmentMember = await this.deptRepository.findOne({
            where: {
                departmentID: departmentID,
            },
            relations: ['students']
        });

        if (!updateDepartmentMember) {
            throw new ForbiddenException('Invalid departmentID');
        }

        // started update here
        let isChanged = false;

        // check if studentID from param is exist on this department or not
        const studentIndex = updateDepartmentMember.students.findIndex(student => student.studentID === studentIDFromParam);
        if (studentIndex === -1) {
            throw new ForbiddenException('This studentID from param is not valid or not exist');
        }

        if (updateDto.studentID && updateDto.studentID !== studentIDFromParam) {
            const checkValidUpStudentID = await this.studentService.checkValidId(updateDto.studentID);
            if (!checkValidUpStudentID) {
                throw new ForbiddenException(`This studentID ${updateDto.studentID} is not valid`);
            }

            const checkExistUpdateStudentID = await this.studentService.findByID(updateDto.studentID);
            if (!checkExistUpdateStudentID) {
                throw new ForbiddenException(`This new studentID ${updateDto.studentID} is not exist on this application`);
            }

            // check if this studentID is exist on this department or not
            const checkExistStudentIDOnDept = await this.findByStudentID(departmentID, updateDto.studentID);
            if (checkExistStudentIDOnDept) {
                throw new ForbiddenException(`This student ${updateDto.studentID} is already exist on this club`);
            }

            updateDto.student = checkExistUpdateStudentID;
            isChanged = true;
        }

        updateDepartmentMember.students[studentIndex] = updateDto.student;

        if (!isChanged) {
            return 'Nothing changed';
        }

        await this.deptRepository.save(updateDepartmentMember);

        const responseData = {
            students: updateDto.student,
        };

        return responseData;
    }

    /*
    [DELETE]: /department-member/{studentID}
    */
    async deleteDepartmentMember(departmentID: string, studentIDFromParam: string) {
        const delDeptMember = await this.deptRepository.findOne({
            where: {
                departmentID: departmentID
            },
            relations: ['students']
        });

        if (!delDeptMember) {
            throw new ForbiddenException('Invalid DepartmentID');
        }

        let isDeleted = false;

        const studentIndex = delDeptMember.students.findIndex(student => student.studentID === studentIDFromParam);

        if (studentIndex === -1) {
            throw new ForbiddenException(`This studentID ${studentIDFromParam} does not exist in this department`);
        } else {
            isDeleted = true;
        }

        //Remove the student from department
        delDeptMember.students.splice(studentIndex, 1);

        // Save the udpated department
        await this.deptRepository.save(delDeptMember);

        return isDeleted;
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
