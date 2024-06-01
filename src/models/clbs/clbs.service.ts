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
    async createClbs(clbsDto: ClbsDto): Promise<Clbs | null> {
        if (!clbsDto.name || clbsDto.name === "") {
            return null;
        }

        const newClbs = this.clbsRepository.create(clbsDto);

        if (!newClbs.avt) {
            newClbs.avt = 'not set avt yet';
        }

        const savedClbs = await this.clbsRepository.save(newClbs);

        return {
            id: savedClbs.id,
            name: savedClbs.name,
            avt: savedClbs.avt,
        }
    }

    async updateClbs(clbsDto: ClbsDto, id: string): Promise<Clbs | null> {
        const clb = await this.findById(id);
        
        if (!clb) {
            return null;
        }

        clb.avt = clbsDto.avt || clb.avt;
        clb.name = clbsDto.name || clb.name;

        const updatedClb = await this.clbsRepository.save(clb);

        return {
            id: updatedClb.id,
            name: updatedClb.name,
            avt: updatedClb.avt
        };
    }

    async findByName(name: string): Promise<Clbs | null> {
        const existClb = await this.clbsRepository.findOne({
            where: {
                name: name,
            }
        });
        return existClb;
    }

    async findById(id: string): Promise<Clbs | null> {
        const existClb = await this.clbsRepository.findOne({
            where: {
                id: id,
            }
        });
        return existClb;
    }
}