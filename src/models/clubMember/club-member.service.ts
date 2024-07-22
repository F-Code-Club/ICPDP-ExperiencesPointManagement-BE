import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clbs } from '../clbs/clbs.entity';
import { Repository } from 'typeorm';
import { Students } from '../students/students.entity';
import { StudentsService } from '../students/students.service';
import { AddClubMemberDto } from './dto/club-meber-post-request.dto';
import { UpdateClubMemberDto } from './dto/club-member-patch-request.dto';

@Injectable()
export class ClubMemberService {
    constructor (
        @InjectRepository(Clbs)
        private clubRepository: Repository<Clbs>,
        @InjectRepository(Students)
        private studentRepository: Repository<Students>,
        private readonly studentService: StudentsService,
    ) {};

    /*
    [POST]: club-member/{clubID}
    */
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

    /*
    [PATCH]: club-member/{clubID&studentID}
    */
    async updateClubMember(clubID: string, updateDto: UpdateClubMemberDto, studentIDFromParam: string) {
        const updateClubMember = await this.clubRepository.findOne({ 
            where: {
                clubID: clubID,
            },
            relations: ['students']
        });

        if (!updateClubMember) {
            throw new ForbiddenException('Invalid clubID');
        }

        // started update here
        let isChanged = false;

        // check if studentID from param is exist on this club or not
        const studentIndex = updateClubMember.students.findIndex(student => student.studentID === studentIDFromParam);
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

            // check if this studentID is exist on this club or not
            const checkExistStudentIDOnClub = await this.findByStudentID(clubID, updateDto.studentID);
            if (checkExistStudentIDOnClub) {
                throw new ForbiddenException(`This student ${updateDto.studentID} is already exist on this club`);
            }

            updateDto.student = checkExistUpdateStudentID;
            isChanged = true;
        }

        updateClubMember.students[studentIndex] = updateDto.student;

        if (!isChanged) {
            return 'Nothing changed';
        }

        await this.clubRepository.save(updateClubMember);

        const responseData = {
            students: updateDto.student,
        };
        
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
