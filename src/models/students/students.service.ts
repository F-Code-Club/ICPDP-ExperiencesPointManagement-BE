import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Students } from './students.entity';
import { Repository } from 'typeorm';
import { StudentsDto } from 'src/dto/students.dto';

@Injectable()
export class StudentsService {
    constructor (
        @InjectRepository(Students)
        private studentsRepository: Repository<Students>,
    ) {};

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

        if (!checkValid) {
            throw new ForbiddenException("ID must follow the standards of FPT University's student code");
        }

        const checkExistStudent = await this.findByID(studentDto.studentID);

        if (checkExistStudent) {
            throw new ForbiddenException('This student ID has been existed');
        }

        const newStudent = this.studentsRepository.create(studentDto);

        return await this.studentsRepository.save(newStudent);
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
        const regex = /^[A-Z]{2}\d{6}$/;

        return regex.test(id);
    }
}
