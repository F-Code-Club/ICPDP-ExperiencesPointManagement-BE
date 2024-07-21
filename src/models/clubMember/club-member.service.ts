import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clbs } from '../clbs/clbs.entity';
import { Repository } from 'typeorm';
import { Students } from '../students/students.entity';
import { StudentsService } from '../students/students.service';
import { AddClubMemberDto } from './dto/club-meber-post-request.dto';

@Injectable()
export class ClubMemberService {
    constructor (
        @InjectRepository(Clbs)
        private clubRepository: Repository<Clbs>,
        @InjectRepository(Students)
        private studentRepository: Repository<Students>,
        private readonly studentService: StudentsService,
    ) {};

    async addMember(clubID: string, addMemberDto: AddClubMemberDto) {
        // check valid of studentID
        const checkStudentID = await this.studentService.checkValidId(addMemberDto.studentID);
        if (!checkStudentID) {
            throw new ForbiddenException("ID must follow the standards of FPT University's student code");
        }

        // check if this studentID is exist on this club or not
        const checkExistStudentIDOnClub = await this.findByStudentID(clubID, addMemberDto.studentID);
        if (checkExistStudentIDOnClub) {
            throw new ForbiddenException(`This student ${addMemberDto.studentID} is already exist on this club`);
        }

        // check if this studentID is exist on this application or not
        const checkExistStudentOnSystem = await this.studentService.findByID(addMemberDto.studentID);
        if (!checkExistStudentOnSystem) {
            throw new ForbiddenException(`This student ${addMemberDto.studentID} is not exist on this application`);
        }
        addMemberDto.students = checkExistStudentOnSystem;

        const addMemberToClub = await this.clubRepository.findOne({
            where: {
                clubID: clubID
            },
            relations: ['students']
        });

        if (!addMemberToClub.students) {
            addMemberToClub.students = [];
        }

        addMemberToClub.students.push(addMemberDto.students);

        await this.clubRepository.save(addMemberToClub);

        const responseData = {
            students: addMemberDto.students
        }
        return responseData;
    }

    async findByStudentID(clubID: string, studentID: string) {
        const exist = await this.clubRepository.findOne({ 
            where: {
                clubID: clubID,
                students: {
                    studentID: studentID
                }
            }
        });
        return exist;
    }
}
