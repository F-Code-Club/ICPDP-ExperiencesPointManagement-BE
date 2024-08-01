import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clbs } from '../clbs/clbs.entity';
import { Repository } from 'typeorm';
import { Students } from '../students/students.entity';
import { StudentsService } from '../students/students.service';
import { UpdateClubMemberDto } from './dto/club-member-patch-request.dto';
import { GetClubMemberDto } from './dto/club-member-get-request.dto';
import { AddMemberDto } from 'src/dto/addMember.dto';

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
    [GET]: club-member
    */
    async getClubMember(clubID: string, dto: GetClubMemberDto): Promise<[Students[], number]> {
        if (dto.page < 1) {
            throw new ForbiddenException('page must greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }

        const queryBuilder = this.studentRepository.createQueryBuilder('student')
            .innerJoin('clubmember', 'cm', 'cm.studentID = student.studentID')
            .where('cm.clubID = :clubID', { clubID })
            .skip(dto.take * (dto.page - 1))
            .take(dto.take);

        const [students, total] = await queryBuilder.getManyAndCount();

        return [students, total];
    }

    /*
    [POST]: club-member
    */
    async addMember(clubID: string, addMemberDto: AddMemberDto) {
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
    [POST]: club-member/import
    */
    async importStudentsFromExcel(addMemberDto: AddMemberDto[], clubID: string) {
        const importedStudents: Students[] = [];
        const addMemberToClub = await this.clubRepository.findOne({
            where: {
                clubID: clubID
            },
            relations: ['students']
        });

        if (!addMemberToClub.students) {
            addMemberToClub.students = [];
        }

        // Filter and validate each student
        await Promise.all(
            addMemberDto.map(async (dto) => {
                const isValidId = await this.studentService.checkValidId(dto.studentID);
                const existStudent = await this.studentService.findByID(dto.studentID);
                const existOnClub = await this.findByStudentID(clubID, dto.studentID);

                if (!isValidId) {
                    throw new ForbiddenException(`Invalid student ID: ${dto.studentID}`);
                }

                if (!existStudent) {
                    throw new ForbiddenException(`student ID ${dto.studentID} have not existed on this application`);
                } else {
                    dto.students = existStudent;
                }

                if (existOnClub) {
                    throw new ForbiddenException(`studentID ${dto.studentID} already exist on this club`);
                }

                addMemberToClub.students.push(dto.students);

                importedStudents.push(dto.students);
            })      
        );

        await this.clubRepository.save(addMemberToClub);

        const responseData = {
            students: importedStudents
        }
        return responseData;
    }

    /*
    [PATCH]: club-member/{studentID}
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

    /*
    [DELETE]: /club-member/{studentID}
    */
    async deleteClubMember(clubID: string, studentIDFromParam: string) {
        const delClubMember = await this.clubRepository.findOne({
            where: {
                clubID: clubID
            },
            relations: ['students']
        });

        if (!delClubMember) {
            throw new ForbiddenException('Invalid clubID');
        }

        let isDeleted = false;

        const studentIndex = delClubMember.students.findIndex(student => student.studentID === studentIDFromParam);

        if (studentIndex === -1) {
            throw new ForbiddenException(`This studentID ${studentIDFromParam} does not exist in this club`);
        } else {
            isDeleted = true;
        }

        //Remove the student from club
        delClubMember.students.splice(studentIndex, 1);

        // Save the udpated club
        await this.clubRepository.save(delClubMember);

        return isDeleted;
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
