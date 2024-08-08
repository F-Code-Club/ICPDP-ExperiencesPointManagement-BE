import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalPoint } from './final-point.entity';
import { Repository } from 'typeorm';
import { FinalPointFilterDto } from './dto/final-point-filter.dto';
import { FinalPointUpdateDto } from './dto/final-point-patch-request.dto';
import { FinalPointAddDto } from './dto/final-point-add.dto';
import { EventPoint } from '../eventPoint/event-point.entity';
import { Students } from '../students/students.entity';

@Injectable()
export class FinalPointService {
    constructor (
        @InjectRepository(FinalPoint)
        private finalPointRepository: Repository<FinalPoint>,
        @InjectRepository(EventPoint)
        private eventPointRepository: Repository<EventPoint>,
        @InjectRepository(Students)
        private studentsRepository: Repository<Students>,
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

        const totalStudyPoint = updatedFinalPoint.studyPoint.extraPoint;
        const totalActivityPoint = updatedFinalPoint.activityPoint.extraPoint1 + updatedFinalPoint.activityPoint.extraPoint2 + updatedFinalPoint.activityPoint.extraPoint3 + updatedFinalPoint.activityPoint.extraPoint4 + updatedFinalPoint.activityPoint.extraPoint5;
        const totalCitizenshipPoint = updatedFinalPoint.citizenshipPoint.extraPoint;
        const totalOrganizationPoint = updatedFinalPoint.organizationPoint.extraPoint;
        const totalFinalPoint = totalStudyPoint + totalActivityPoint + totalCitizenshipPoint + totalOrganizationPoint;
        let classification: string = "";

        if (totalFinalPoint < 80) {
            classification = "Khá";
        } else if (totalFinalPoint >= 80 && totalFinalPoint < 90) {
            classification = "Tốt";
        } else {
            classification = "Xuất sắc";
        }

        const responseData = {
            studentID: updatedFinalPoint.student.studentID,
            studentName: updatedFinalPoint.student.name,
            studyPoint: updatedFinalPoint.studyPoint,
            totalStudyPoint: totalStudyPoint,
            activityPoint: updatedFinalPoint.activityPoint,
            totalActivityPoint: totalActivityPoint,
            citizenshipPoint: updatedFinalPoint.citizenshipPoint,
            totalCitizenshipPoint: totalCitizenshipPoint,
            organizationPoint: updatedFinalPoint.organizationPoint,
            totalOrganizationPoint: totalOrganizationPoint,
            totalFinalPoint: totalFinalPoint,
            classification: classification,
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
        
        let existFinalPoints = await this.finalPointRepository.find({
            where: {
                semester: {
                    semesterID: semesterID.toLowerCase(),
                }
            },
            relations: ['student']
        });

        // check the current year and current semester
        const now = new Date();
        const currentYear = now.getFullYear();
        let currentSemester: string;
        const currentMonth = now.getMonth() + 1;
        if (currentMonth >= 1 && currentMonth <= 4) {
            currentSemester = 'spring';
        } else if (currentMonth >= 5 && currentMonth <= 8) {
            currentSemester = 'summer';
        } else if (currentMonth >= 9 && currentMonth <= 12) {
            currentSemester = 'fall';
        }
        
        // Check conditions and throw errors if necessary
        if (existFinalPoints.length === 0) {
            if (currentYear === Number(year)) {
                if (currentSemester === semester) {                
                    // take all students on this application and create with them a new final point for the current semester 
                    const allStudents = await this.studentsRepository.find({
                        order: { studentID: 'ASC' }
                    });

                    const addToFinalPoint: FinalPointAddDto[] = allStudents.map((student) => ({
                        studentID: student.studentID,
                        student: student
                    }));
                    existFinalPoints = await this.addFinalPoints(addToFinalPoint);
                } else {
                    throw new ForbiddenException(`This ${semester} semester has not been started yet`);
                }
            } else {
                throw new ForbiddenException(`The year ${year} is not valid`);
            }
        }

        await Promise.all(
            existFinalPoints.map(async (fp) => {
                const totalPersonalPoint = await this.takeActivePointFromEventPoint(fp.student.studentID, year, semester);
                
                fp.activityPoint.extraPoint1 = totalPersonalPoint;

                await this.finalPointRepository.save(fp);
            })
        );

        return existFinalPoints.map(fp => {
            // total = extra + default
            const totalStudyPoint = fp.studyPoint.extraPoint + 20;
            const totalActivityPoint = fp.activityPoint.extraPoint1 + fp.activityPoint.extraPoint2 + fp.activityPoint.extraPoint3 + fp.activityPoint.extraPoint4 + fp.activityPoint.extraPoint5 + 15;
            const totalCitizenshipPoint = fp.citizenshipPoint.extraPoint + 15;
            const totalOrganizationPoint = fp.organizationPoint.extraPoint + 10;
            const totalFinalPoint = totalStudyPoint + totalActivityPoint + totalCitizenshipPoint + totalOrganizationPoint;
            let classification: string = "";
    
            if (totalFinalPoint < 80) {
                classification = "Khá";
            } else if (totalFinalPoint >= 80 && totalFinalPoint < 90) {
                classification = "Tốt";
            } else {
                classification = "Xuất sắc";
            }
    
            return {
                studentID: fp.student.studentID,
                studentName: fp.student.name,
                studyPoint: fp.studyPoint,
                totalStudyPoint: totalStudyPoint > 35 ? 35 : totalStudyPoint, // max of totalStudyPoint is 35
                activityPoint: fp.activityPoint,
                totalActivityPoint: totalActivityPoint > 50 ? 50 : totalActivityPoint, // max of totalActivityPoint is 50
                citizenshipPoint: fp.citizenshipPoint,
                totalCitizenshipPoint: totalCitizenshipPoint > 25 ? 25 : totalCitizenshipPoint, // max of totalCitizenshipPoint is 25
                organizationPoint: fp.organizationPoint,
                totalOrganizationPoint: totalOrganizationPoint > 30 ? 30 : totalOrganizationPoint, // max of totalOrganizationPoint is 30
                totalFinalPoint: totalFinalPoint,
                classification: classification,
            };
        });
    }

    async addFinalPoints (dto: FinalPointAddDto[] | FinalPointAddDto) {
        const now = new Date();
        const currentYear = now.getFullYear();
        let currentSemester: string;

        const currentMonth = now.getMonth() + 1;

        if (currentMonth >= 1 && currentMonth <= 4) {
            currentSemester = 'spring';
        } else if (currentMonth >= 5 && currentMonth <= 8) {
            currentSemester = 'summer';
        } else if (currentMonth >= 9 && currentMonth <= 12) {
            currentSemester = 'fall';
        }

        const semesterID = `${currentSemester}${currentYear}`;
        if (!Array.isArray(dto)) {
            dto = [dto];
        }

        const finalPoints = dto.map(item => {
            const newFinalPoint = this.finalPointRepository.create({
                student: { studentID: item.studentID },
                semester: { semesterID },
                studyPoint: item.studyPoint,
                activityPoint: item.activityPoint,
                citizenshipPoint: item.citizenshipPoint,
                organizationPoint: item.organizationPoint,
            });
            return newFinalPoint;
        });

        return await this.finalPointRepository.save(finalPoints);
    }

    async takeActivePointFromEventPoint (studentID: string, year: number, semester: string) {
        const eventPoints = await this.eventPointRepository.find({
            where: {
                student: {
                    studentID: studentID
                },
                event: {
                    year: year,
                    semester: semester
                }
            },
            relations: ['student', 'event']
        });

        if (eventPoints.length === 0) {
            return 0;
        }

        const totalPoints = eventPoints.reduce((sum, eventPoint) => sum + eventPoint.point, 0);

        return totalPoints;
    }
}
