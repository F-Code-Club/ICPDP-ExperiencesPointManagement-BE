import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleClbs } from './roleClbs.entity';
import { Repository } from 'typeorm';
import { RoleClbsDto } from 'src/dto/roleClbs.dto';
import { UpdateRoleClubDto } from './dto/role-clbs-update-request.dto';
import { RoleClubFilterDto } from './dto/role-clbs-filter.dto';

@Injectable()
export class RoleClbsService {
    constructor  (
        @InjectRepository(RoleClbs)
        private roleClbRepository: Repository<RoleClbs>
    ) {};

    /* 
    [GET]: /roleclubs/page?&&take?
    */
    async getRoleClubs (dto: RoleClubFilterDto) {
        if (dto.page < 1) {
            throw new ForbiddenException('page must greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }
        return await this.roleClbRepository.findAndCount({
            take: dto.take,
            skip: dto.take*(dto.page - 1),
        });
    }

    /*
    [POST]: /roleclubs/
    */
    async addRoleClub (roleClubDto: RoleClbsDto): Promise<RoleClbs> {
        const checkExistRole = await this.findByName(roleClubDto.role);
        if (checkExistRole) {
            throw new ForbiddenException(`This role ${roleClubDto.role} is already exist`);
        }

        const createRoleClub = this.roleClbRepository.create(roleClubDto);

        const saveRoleClub = await this.roleClbRepository.save(createRoleClub);
        return saveRoleClub;
    }

    /*
    [PATCH]: /roleclubs/{ID}
    */
    async updateRoleClub (id: string, updateDto: UpdateRoleClubDto) {
        // find by ID to check exist role
        const checkExistRole = await this.findById(id);
        if (!checkExistRole) {
            throw new ForbiddenException('This role is not exist');
        }

        // check if the new role is exist or not
        const checkExistName = await this.findByName(updateDto.role);
        if (checkExistName !== null && (checkExistName.roleClubID !== checkExistRole.roleClubID)) {
            throw new ForbiddenException(`This role ${updateDto.role} is already exist`);
        }

        let isChanged = false;

        if (updateDto.role && updateDto.role !== checkExistRole.role) {
            checkExistRole.role = updateDto.role;
            isChanged = true;
        }

        if (updateDto.point && updateDto.point !== checkExistRole.point) {
            checkExistRole.point = updateDto.point;
            isChanged = true;
        }

        if (!isChanged) {
            return 'Nothing changed';
        }

        const updatedRoleClub = await this.roleClbRepository.save(checkExistRole);

        return updatedRoleClub;
    }

    /*
    [DELETE]: /roleclubs/{ID}
    */
    async deleteRoleClub (id: string): Promise<Number | null> {
        const checkRole = await this.findById(id);
        if (!checkRole) {
            return null;
        }
        const res = await this.roleClbRepository.delete(id);
        return res.affected;
    }

    async findByName (role: string): Promise<RoleClbs | null> {
        const existRole = await this.roleClbRepository.findOne({
            where: {
                role: role,
            }
        });
        return existRole;
    }

    async findById (id: string): Promise<RoleClbs | null> {
        const existRole = await this.roleClbRepository.findOne({
            where: {
                roleClubID: id,
            }
        });
        return existRole;
    }
}
