import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalPoint } from './final-point.entity';
import { In, Repository } from 'typeorm';
import { FinalPointFilterDto } from './dto/final-point-filter.dto';
import { FinalPointUpdateDto } from './dto/final-point-patch-request.dto';
import { FinalPointAddDto } from './dto/final-point-add.dto';
import { EventPoint } from '../eventPoint/event-point.entity';
import { Students } from '../students/students.entity';
import { Semesters } from '../semesters/semesters.entity';
import { Events, StatusPermission } from '../event/event.entity';

@Injectable()
export class FinalPointService {
    constructor (
        @InjectRepository(FinalPoint)
        private finalPointRepository: Repository<FinalPoint>,
        @InjectRepository(EventPoint)
        private eventPointRepository: Repository<EventPoint>,
        @InjectRepository(Students)
        private studentsRepository: Repository<Students>,
        @InjectRepository(Semesters)
        private semesterRepository: Repository<Semesters>,
        @InjectRepository(Events)
        private eventsRepository: Repository<Events>
    ) {};

    /*
    [GET]: /final-point/{year}&{semester}
    */
    async getFinalPoints(dto: FinalPointFilterDto, year: number, semester: string, orderBy: string, order: string) {
        if (dto.page < 1) {
            throw new ForbiddenException('page must greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }

        const semesterIDToFound = `${semester}${year}`;

        orderBy = this.asignedValueToOrderBy(orderBy);

        return await this.finalPointRepository.findAndCount({
            relations: ['student'],
            take: dto.take,
            skip: dto.take*(dto.page - 1),
            where: {
                semester: {
                    semesterID: semesterIDToFound.toLowerCase().trim(),
                }
            },
            order: { 
                [orderBy]: order
            }
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

        const existSemester = await this.semesterRepository.findOne({
            where: {
                semesterID: semesterID.toLowerCase(),
            }
        });
        
        // Check conditions and throw errors if necessary
        if (existFinalPoints.length === 0 && !existSemester) {        
            throw new ForbiddenException(`This ${semesterID} is not exist on this application`);
        } else if (existSemester && existFinalPoints.length === 0) {
            // Using QueryBuilder to find missing students directly
            const missingStudents = await this.studentsRepository.createQueryBuilder('student')
            .where(
                `NOT EXISTS (
                    SELECT 1 FROM final_point fp
                    WHERE fp.studentID = student.studentID
                    AND fp.semesterID = :semesterID
                )`,
                { semesterID: semesterID.toLowerCase() }
            )
            .orderBy('student.studentID', 'ASC')
            .getMany();

            if (missingStudents.length > 0) {
                const addToFinalPoint: FinalPointAddDto[] = missingStudents.map((student) => ({
                    studentID: student.studentID,
                    student: student
                }));
                const newFinalPoints = await this.addFinalPoints(addToFinalPoint, year, semester);
                existFinalPoints = [...existFinalPoints, ...newFinalPoints];
            }
        }

        for (const fp of existFinalPoints) {
            const result = await this.takeActivePointFromEventPoint(fp.student.studentID, year, semester);
    
            if (typeof result === 'object' && 'eventIDs' in result) {
                const { totalPoints, eventIDs } = result;
    
                fp.activityPoint.extraPoint1 = totalPoints;
    
                await this.eventsRepository.update({ eventID: In(eventIDs) }, { statusFillPoint: true });
            }
    
            await this.finalPointRepository.save(fp);
        }

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

    async addFinalPoints (dto: FinalPointAddDto[] | FinalPointAddDto, year?: number, semester?: string) {
        const semesterID = `${semester}${year}`.toLowerCase();

        const existSemester = await this.semesterRepository.findOne({
            where: {
                semesterID: semesterID
            }
        });
        if (!existSemester) {
            throw new ForbiddenException(`This ${semesterID} semester is not exist on this application`);
        }

        if (!Array.isArray(dto)) {
            dto = [dto];
        }

        const finalPoints = [];

        for (const item of dto) {
            const existStudent = await this.studentsRepository.findOne({
                where: {
                    studentID: item.studentID
                }
            });

            if (!existStudent) {
                throw new ForbiddenException(`Student ${existStudent.studentID} is not exist on this application`);
            }

            const newFinalPoint = this.finalPointRepository.create({
                student: existStudent,
                semester: existSemester,
                studyPoint: item.studyPoint,
                activityPoint: item.activityPoint,
                citizenshipPoint: item.citizenshipPoint,
                organizationPoint: item.organizationPoint,
            });

            finalPoints.push(newFinalPoint);
        }

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
                    semester: semester,
                    adminPermission: {
                        status: StatusPermission.Approved
                    }
                }
            },
            relations: ['student', 'event']
        });

        if (eventPoints.length === 0) {
            return 0;
        }

        const totalPoints = eventPoints.reduce((sum, eventPoint) => sum + eventPoint.point, 0);
        const eventIDs = eventPoints.map(eventPoint => eventPoint.event.eventID); 

        return { totalPoints, eventIDs };
    }

    async deleteByStudentID (studentID: string) {
        const existStudents = await this.finalPointRepository.find({
            where: {
                student: {
                    studentID: studentID
                }
            }
        });

        return await this.finalPointRepository.remove(existStudents);
    }

    asignedValueToOrderBy (orderBy: string) {
        if (orderBy === 'studentID') {
            orderBy = 'student.studentID';
        } else if (orderBy === 'studyPoint') {
            orderBy = 'studyPoint.extraPoint';
        } else if (orderBy === 'activityPoint') {
            orderBy = 'activityPoint.extraPoint1';
        } else if (orderBy === 'citizenshipPoint') {
            orderBy = 'citizenshipPoint.extraPoint';
        } else if (orderBy === 'organizationPoint') {
            orderBy = 'organization.extraPoint';
        }
        return orderBy;
    }
}
