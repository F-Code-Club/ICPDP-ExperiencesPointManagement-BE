import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalPoint, OrganizationPoint } from './final-point.entity';
import { Repository } from 'typeorm';
import { FinalPointFilterDto } from './dto/final-point-filter.dto';
import { FinalPointUpdateDto } from './dto/final-point-patch-request.dto';

@Injectable()
export class FinalPointService {
    constructor (
        @InjectRepository(FinalPoint)
        private finalPointRepository: Repository<FinalPoint>,
    ) {};

    /*
    [GET]: /final-point/{year}&{semester}
    */
    async getFinalPoints(dto: FinalPointFilterDto, year: number, semester: string) {
        if (dto.page < 1) {
            throw new ForbiddenException('page must greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }

        const semesterIDToFound = `${semester}${year}`;

        return await this.finalPointRepository.findAndCount({
            relations: ['student'],
            take: dto.take,
            skip: dto.take*(dto.page - 1),
            where: {
                semester: {
                    semesterID: semesterIDToFound.toLowerCase().trim(),
                }
            },
            order: { createdAt: 'ASC' }
        });
    }

    /*
    [PATCH]: /final-point/{year}&{semester}&{studentID}
    */
    async updateFinalPoints(updateDto: FinalPointUpdateDto, year: number, semester: string, studentID: string) {
        const checkExistFinalPoint = await this.findBySemesterStudent(year, semester, studentID);
        if (!checkExistFinalPoint) {
            throw new ForbiddenException(`This studentID ${studentID} or semester is not valid`);
        }

        let isChanged = false;
        //update start here

        //update Study point here
        if (checkExistFinalPoint.studyPoint.extraPoint !== updateDto.studyPoint.extraPoint) {
            checkExistFinalPoint.studyPoint.extraPoint = updateDto.studyPoint.extraPoint;
            isChanged = true;
        }  
        if (checkExistFinalPoint.studyPoint.comment !== updateDto.studyPoint.comment) {
            checkExistFinalPoint.studyPoint.comment = updateDto.studyPoint.comment;
            isChanged = true;
        }
        //update Study point end

        //update Activity point here
        if (checkExistFinalPoint.activityPoint !== updateDto.activityPoint) {
            checkExistFinalPoint.activityPoint = updateDto.activityPoint;
            isChanged = true;
        }
        //update Activity point end

        //update Citizenship point here
        if (checkExistFinalPoint.citizenshipPoint.extraPoint !== updateDto.citizenshipPoint.extraPoint) {
            checkExistFinalPoint.citizenshipPoint.extraPoint = updateDto.citizenshipPoint.extraPoint;
            isChanged = true;
        }
        if (checkExistFinalPoint.citizenshipPoint.comment !== updateDto.citizenshipPoint.comment) {
            checkExistFinalPoint.citizenshipPoint.comment = updateDto.citizenshipPoint.comment;
            isChanged = true;
        }
        //updae Citizenship point end

        //update Organization point here
        if (checkExistFinalPoint.organizationPoint.extraPoint !== updateDto.organizationPoint.extraPoint) {
            checkExistFinalPoint.organizationPoint.extraPoint = updateDto.organizationPoint.extraPoint;
            isChanged = true;
        }
        if (checkExistFinalPoint.organizationPoint.comment !== updateDto.organizationPoint.comment) {
            checkExistFinalPoint.organizationPoint.comment = updateDto.organizationPoint.comment;
            isChanged = true;
        }
        //update Organization point end

        if (!isChanged) {
            return 'Nothing changed';
        }

        const updatedFinalPoint = await this.finalPointRepository.save(checkExistFinalPoint);

        const responseData = {
            studentID: updatedFinalPoint.student.studentID,
            studentName: updatedFinalPoint.student.name,
            studyPoint: updatedFinalPoint.studyPoint,
            activityPoint: updatedFinalPoint.activityPoint,
            citizenshipPoint: updatedFinalPoint.citizenshipPoint,
            organizationPoint: updatedFinalPoint.organizationPoint,
        };

        return responseData;
    }

    async findBySemesterStudent(year: number, semester: string, studentID: string) {
        const semesterID = `${semester}${year}`;
        const existFinalPoint = await this.finalPointRepository.findOne({
            where: {
                semester: {
                    semesterID: semesterID.toLowerCase(),
                },
                student: {
                    studentID: studentID,
                }
            },
            relations:['student']
        });
        return existFinalPoint;
    }

    /*
    [POST]: /final-point/{year}&{semester}
    */
    async findBySemester(year: number, semester: string) {
        const semesterID = `${semester}${year}`;
        
        const existFinalPoints = await this.finalPointRepository.find({
            where: {
                semester: {
                    semesterID: semesterID.toLowerCase(),
                }
            },
            relations: ['student']
        });

        return existFinalPoints.map(fp => ({
            studentID: fp.student.studentID,
            studentName: fp.student.name,
            studyPoint: fp.studyPoint,
            activityPoint: fp.activityPoint,
            citizenshipPoint: fp.citizenshipPoint,
            organizationPoint: fp.organizationPoint
        }));
    }
}
