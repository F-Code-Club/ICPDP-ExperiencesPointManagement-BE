import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalPoint } from './final-point.entity';
import { Repository } from 'typeorm';
import { FinalPointFilterDto } from './dto/final-point-filter.dto';

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
            }
        });
    }

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

        return existFinalPoints;
    }
}
