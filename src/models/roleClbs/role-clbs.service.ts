import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleClbs } from './roleClbs.entity';
import { Repository } from 'typeorm';
import { RoleClbsDto } from 'src/dto/roleClbs.dto';

@Injectable()
export class RoleClbsService {
    constructor  (
        @InjectRepository(RoleClbs)
        private roleClbRepository: Repository<RoleClbs>
    ) {};

    /*
    [POST]: /roleclubs/
    */
    async addRoleClub (roleClubDto: RoleClbsDto): Promise<RoleClbs> {
        const checkExistRole = await this.findByName(roleClubDto.name);
        if (checkExistRole) {
            throw new ForbiddenException(`This role ${roleClubDto.name} is already exist`);
        }

        const createRoleClub = this.roleClbRepository.create(roleClubDto);

        const saveRoleClub = await this.roleClbRepository.save(createRoleClub);
        return saveRoleClub;
    }

    async findByName (name: string): Promise<RoleClbs | null> {
        const existRole = await this.roleClbRepository.findOne({
            where: {
                name: name,
            }
        });
        return existRole;
    }
}
