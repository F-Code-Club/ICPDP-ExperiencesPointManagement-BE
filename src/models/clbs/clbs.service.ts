import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clbs } from './clbs.entity';
import { Repository } from 'typeorm';
import { ClbsDto } from 'src/dto/clbs.dto';

@Injectable()
export class ClbsService {
    constructor (
        @InjectRepository(Clbs)
        private clbsRepository: Repository<Clbs>,
    ) {};

    /*
    [POST]: create-clbs
    */
    async createClbs(clbsDto: ClbsDto): Promise<ClbsDto | null> {
        const newClbs = this.clbsRepository.create(clbsDto);

        if (!newClbs.avt) {
            newClbs.avt = 'not set avt yet';
        }

        const savedClbs = await this.clbsRepository.save(newClbs);

        return {
            name: savedClbs.name,
            avt: savedClbs.avt,
        }
    }
}
