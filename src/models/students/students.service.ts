import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Students } from './students.entity';
import { Repository } from 'typeorm';
import { StudentsDto } from 'src/dto/students.dto';
import { UpdateStudentRequestDto } from './dto/students-update-request.dto';
import { StudentsFilterDto } from './dto/students-filter.dto';
import { FinalPointService } from '../final-point/final-point.service';
import { FinalPointAddDto } from '../final-point/dto/final-point-add.dto';
import { EventPoint } from '../eventPoint/event-point.entity';
import { Clbs } from '../clbs/clbs.entity';
import { Departments } from '../departments/departments.entity';

@Injectable()
export class StudentsService {
    constructor (
        @InjectRepository(Students)
        private studentsRepository: Repository<Students>,
        private readonly finalPointService: FinalPointService,
        @InjectRepository(EventPoint)
        private eventPointRepository: Repository<EventPoint>,
        @InjectRepository(Clbs)
        private clubRepository: Repository<Clbs>,
        @InjectRepository(Departments)
        private departmentRepository: Repository<Departments>,
    ) {};

    /*
    [GET]: /students/page?&&take?
    */
    async getStudents(dto: StudentsFilterDto) {
        if (dto.page < 1) {
            throw new ForbiddenException('page must greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }
        return await this.studentsRepository.findAndCount({
            take: dto.take,
            skip: dto.take*(dto.page - 1),
            order: { studentID: 'ASC' }
        });
    }

    /*
    [GET]: /students/{id}
    */
    async getStudentById(id: string): Promise<Students | null> {
        const checkValid = await this.checkValidId(id);

        if (!checkValid) {
            throw new ForbiddenException("ID must follow the standards of FPT University's student code");
        }

        const checkExistStudent = await this.findByID(id);

        return checkExistStudent;
    }

    /* 
    [POST]: /students
    */
    async createStudents(studentDto: StudentsDto) {
        const checkValid = await this.checkValidId(studentDto.studentID);
        studentDto.studentID = await this.capitalizeFirstTwoLetters(studentDto.studentID);

        if (!checkValid) {
            throw new ForbiddenException("ID must follow the standards of FPT University's student code");
        }

        const checkExistStudent = await this.findByID(studentDto.studentID);

        if (checkExistStudent) {
            throw new ForbiddenException('This student ID has been existed');
        }

        const newStudent = this.studentsRepository.create(studentDto);

        const responseData = await this.studentsRepository.save(newStudent);

        const addDtoForFinalPoint: FinalPointAddDto = {
            studentID: responseData.studentID,
            student: responseData
        };
        await this.finalPointService.addFinalPoints(addDtoForFinalPoint);

        return responseData;
    }

    /* 
    [POST]: /students/import
    */
    async importStudentsFromExcel(studentsDto: StudentsDto[]) {
        const importedStudents: StudentsDto[] = [];

        // Filter and validate each student
        await Promise.all(
            studentsDto.map(async (studentDto) => {
                const isValidId = await this.checkValidId(studentDto.studentID);
                studentDto.studentID = await this.capitalizeFirstTwoLetters(studentDto.studentID);
                
                const existStudent = await this.findByID(studentDto.studentID);

                if (!isValidId) {
                    throw new ForbiddenException(`Invalid student ID: ${studentDto.studentID}`);
                }

                if (existStudent) {
                    throw new ForbiddenException(`student ID ${studentDto.studentID} already exist`);
                }
                importedStudents.push(studentDto);
            })      
        );

        const newStudents = await this.studentsRepository.save(importedStudents);

        const addDtoForFinalPoints: FinalPointAddDto[] = newStudents.map((student) => ({
            studentID: student.studentID,
            student: student
        }));
        await this.finalPointService.addFinalPoints(addDtoForFinalPoints);

        return newStudents;
    }

    /*
    [PATCH]: /students/{id}
    */
    async updateStudents(studentDto: UpdateStudentRequestDto, id: string) {
        const checkValIdFromParam = await this.checkValidId(id);

        if (!checkValIdFromParam) {
            throw new ForbiddenException("ID must follow the standards of FPT University's student code");
        }   

        const checkStudent = await this.findByID(id);

        if (!checkStudent) {
            return null;
        }

        let isChanged = false;

        if (studentDto.studentID && checkStudent.studentID !== studentDto.studentID) {
            const checkValidID = await this.checkValidId(studentDto.studentID);
            if (!checkValidID) {
                throw new ForbiddenException("ID must follow the standards of FPT University's student code");
            }

            const checkExistID = await this.findByID(studentDto.studentID);
            if(checkExistID) {
                throw new ForbiddenException(`This student ID is already exist: ${studentDto.studentID}`)
            }
            checkStudent.studentID = studentDto.studentID;
            isChanged = true;
        }
        
        if (studentDto.name && checkStudent.name !== studentDto.name) {
            checkStudent.name = studentDto.name;
            isChanged = true;
        }

        if (!isChanged) {
            return 'Nothing changed';
        }

        const updatedStudent = await this.studentsRepository.save(checkStudent);

        return updatedStudent;
    }

    /* 
    [DELETE]: /students/{id}
    */
    async deleteStudents(id: string): Promise<Number | null> {
        const checkValid = await this.checkValidId(id);

        if (!checkValid) {
            throw new ForbiddenException("ID must follow the standards of FPT University's student code");
        }

        const checkStudent = await this.findByID(id);
        
        if (!checkStudent) {
            return null;
        }
        // Delete students on club member
        await this.clubRepository.createQueryBuilder()
        .relation(Clbs, 'students')
        .of(id)
        .remove(id);

        // Delete students on department member
        await this.departmentRepository.createQueryBuilder()
        .relation(Clbs, 'students')
        .of(id)
        .remove(id);

        // Delete students on final point 
        await this.finalPointService.deleteByStudentID(id);

        // Delete students on event point
        const existStudentsOnEventPoint = await this.eventPointRepository.find({
            where: {
                student: {
                    studentID: id
                }
            }
        });
        await this.eventPointRepository.remove(existStudentsOnEventPoint);

        const res = await this.studentsRepository.delete(id);
        return res.affected;
    }

    async findByID(id: string) {
        const existStudent = await this.studentsRepository.findOne({
            where: {
                studentID: id,
            }
        });
        return existStudent;
    }

    async checkValidId(id: string): Promise<boolean> {
        const regex = /^[a-zA-Z]{2}\d{5,6}$/;

        return regex.test(id);
    }

    async capitalizeFirstTwoLetters(id: string) {
        const firstTwoLettersUppercase = id.slice(0, 2).toUpperCase();
        const remainingPart = id.slice(2);

        return firstTwoLettersUppercase + remainingPart;
    }
}
