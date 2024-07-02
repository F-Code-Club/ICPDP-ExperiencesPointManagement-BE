import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Semesters } from './semesters.entity';
import { Repository } from 'typeorm';
import { CreateSemestersRequestDto } from './dto/semesters-create-request.dto';
import { SemesterDto } from 'src/dto/semester.dto';
import { SemestersFilterDto } from './dto/semesters-filter.dto';
import { SemestersUpdateRequestDto } from './dto/semesters-update-request.dto';

@Injectable()
export class SemestersService {
    constructor(
        @InjectRepository(Semesters)
        private semestersRepository: Repository<Semesters>,
    ) {};

    /* 
    [GET]: /semesters
    */
    async getAllSemesters(dto: SemestersFilterDto) {
        if (dto.page < 1) {
            throw new ForbiddenException('page must be greater than or equal to 1');
        } 
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }
        return await this.semestersRepository.findAndCount({
            take: dto.take,
            skip: dto.take*(dto.page - 1),
            order: { year: 'DESC' }
        });
    }

    /*
    [GET]: /semesters/now
    */
    async getCurrentSemester(): Promise<Semesters | null> {
        const currentDate = new Date();
        const semesters = await this.semestersRepository.find();

        for (const semester of semesters) {
            const startDate = this.parseDate(semester.startDate);
            const endDate = this.parseDate(semester.endDate);

            if (currentDate >= startDate && currentDate <= endDate) {
                return semester;
            }
        }

        return null;
    }

    /* 
    [POST]: /semesters
    */
    async createSemesters(semestersDto: CreateSemestersRequestDto) {
        const validSemesters = ["spring", "summer", "fall"];
        const newSemesters: SemesterDto[] = [];

        //Filter and validate each semester in a year
        await Promise.all(
            semestersDto.semesters.map(async (dto) => {
                if (!validSemesters.includes(dto.semester.toLowerCase())) {
                    throw new ForbiddenException(`The semester ${dto.semester} is not valid`);
                }

                dto.semester = dto.semester.toLowerCase();

                const checkYear = await this.findByYear(semestersDto.year);

                if (!checkYear) {
                    throw new ForbiddenException(`The year ${semestersDto.year} is already full of semesters`);
                }

                dto.year = semestersDto.year;

                const checkExistSemester = await this.findById(`${dto.semester.toLowerCase()}${dto.year}`);

                const checkStartDate = await this.isValidDateFormat(dto.startDate);
                const checkEndDate = await this.isValidDateFormat(dto.endDate);
                
                if(checkExistSemester) {
                    throw new ForbiddenException(`The semesterID: ${checkExistSemester.semesterID} is already exist`);
                }

                if (!checkStartDate) {
                    throw new ForbiddenException(`The start date of ${dto.semester.toLowerCase()}${dto.year} is not valid`);
                }

                if (!checkEndDate) {
                    throw new ForbiddenException(`The end date of ${dto.semester.toLowerCase()}${dto.year} is not valid`);
                }

                const startDate = this.parseDate(dto.startDate);
                const endDate = this.parseDate(dto.endDate);
                const startDateYear = startDate.getFullYear();
                const endDateYear = endDate.getFullYear();
        
                if (startDateYear !== dto.year || endDateYear !== dto.year) {                                        
                    throw new ForbiddenException(`The year in the start date or end date does not match the semester year ${semestersDto.year}`);
                }

                newSemesters.push(dto);
            }),
        );

        // Check if all three semesters (spring, summer, fall) are included
        const semesterNames = newSemesters.map(semester => semester.semester);
        if (!validSemesters.every(semester => semesterNames.includes(semester))) {
            throw new ForbiddenException(`You must include all three semesters: ${validSemesters.join(", ")} in a single year`);
        }

        const createSemesters = this.semestersRepository.create(newSemesters);

        const saveSemesters = await this.semestersRepository.save(createSemesters);

        return saveSemesters;
    }

    /*
    [PATCH]: /semesters/{ID}
    */
    async updateSemester (updateDto: SemestersUpdateRequestDto, id: string) {
        const checkSemester = await this.findById(id);

        if (!checkSemester) {
            return null;
        }

        let isChanged = false;

        if (updateDto.startDate && updateDto.startDate !== checkSemester.startDate) {
            const checkStartDate = await this.isValidDateFormat(updateDto.startDate);
            if (checkStartDate) {
                checkSemester.startDate = updateDto.startDate;
                isChanged = true;
            }
        }

        if (updateDto.endDate && updateDto.endDate !== checkSemester.endDate) {
            const checkEndDate = await this.isValidDateFormat(updateDto.endDate);
            if (checkEndDate) {
                checkSemester.endDate = updateDto.endDate;
                isChanged = true;
            }
        }

        if (!isChanged) {
            return 'Nothing changed';
        }

        const updatedSemester = await this.semestersRepository.save(checkSemester);

        return updatedSemester;
    }

    async findById(id: string) {
        const existSemester = await this.semestersRepository.findOne({
            where: {
                semesterID: id,
            }
        });
        return existSemester;
    }

    async findByYear(year: number) {
        let check = false;
        const count = await this.semestersRepository.count({
            where: {
                year: year,
            }
        });
        if (count < 3) {
            check = true;
        }
        return check;
    }

    async isValidDateFormat(dateString: string) {
        // Regex to match DD/MM/YYYY format
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!regex.test(dateString)) {
            return false;
        }
    
        // Extract day, month, year from the date string
        const [, day, month, year] = dateString.match(regex);
    
        // Convert day, month, year to numbers
        const dtDay = parseInt(day, 10);
        const dtMonth = parseInt(month, 10);
        const dtYear = parseInt(year, 10);
    
        // Check if month is valid (1-12)
        if (dtMonth < 1 || dtMonth > 12) {
            return false;
        }
    
        // Check if day is valid for the given month and year
        const daysInMonth = new Date(dtYear, dtMonth, 0).getDate();
        if (dtDay < 1 || dtDay > daysInMonth) {
            return false;
        }
    
        // Check for February and leap years
        if (dtMonth === 2) {
            if (dtDay > 29) {
                return false; // February cannot have more than 29 days
            }
            if (dtDay === 29 && !(dtYear % 4 === 0 && (dtYear % 100 !== 0 || dtYear % 400 === 0))) {
                return false; // February 29 must be a leap year
            }
        }
    
        // If all checks pass, return true
        return true;
    }
    
    parseDate(dateString: string) {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    }
}
