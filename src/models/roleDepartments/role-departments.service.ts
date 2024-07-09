import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleDepartments } from './roleDepartments.entity';
import { Repository } from 'typeorm';
import { RoleDepartmentsDto } from 'src/dto/roleDepartments.dto';
import { UpdateRoleDepartmentDto } from './dto/role-departments-update.dto';
import { RoleDepartmentFilterDto } from './dto/role-department-filter.dto';

@Injectable()
export class RoleDepartmentsService {
    constructor (
        @InjectRepository(RoleDepartments)
        private roleDeptRepository: Repository<RoleDepartments>
    ) {};

    /*
    [GET]: /roledepartments/page?&&take?
    */
    async getRoleDepartments (dto: RoleDepartmentFilterDto) {
        if (dto.page < 1) {
            throw new ForbiddenException('page must greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }
        return await this.roleDeptRepository.findAndCount({
            take: dto.take,
            skip: dto.take*(dto.page - 1),
        });
    }

    /*
    [POST]: /roledepartments/
    */
    async addRoleDepartment (roleDepartmentDto: RoleDepartmentsDto): Promise<RoleDepartments> {
        const checkExistRole = await this.findByName(roleDepartmentDto.role);
        if (checkExistRole) {
            throw new ForbiddenException(`This role ${roleDepartmentDto.role} is already exist`);
        }

        const createRoleDepartment = this.roleDeptRepository.create(roleDepartmentDto);

        const saveRoleDepartment = await this.roleDeptRepository.save(createRoleDepartment);
        return saveRoleDepartment;
    }

    /* 
    [PATCH]: /roledepartments/{ID}
    */
    async updateRoleDepartment(id: string, updateDto: UpdateRoleDepartmentDto) {
        // find by ID to check exist role
        const checkExistRole = await this.findById(id);
        if (!checkExistRole) {
            throw new ForbiddenException('This role is not exist');
        }

        // check if the new role is exist or not
        const checkExistName = await this.findByName(updateDto.role);
        if (checkExistName.roleDepartmentID !== checkExistRole.roleDepartmentID) {
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

        const updatedRoleDepartment = await this.roleDeptRepository.save(checkExistRole);

        return updatedRoleDepartment;
    }

    /*
    [DELETE]: /roledepartments/{ID}
    */
    async deleteRoleDepartment (id: string): Promise<Number | null> {
        const checkRole = await this.findById(id);
        if (!checkRole) {
            return null;
        }
        const res = await this.roleDeptRepository.delete(id);
        return res.affected;
    }

    async findByName (role: string): Promise<RoleDepartments | null> {
        const existRole = await this.roleDeptRepository.findOne({
            where: {
                role: role,
            }
        });
        return existRole;
    }

    async findById (id: string): Promise<RoleDepartments | null> {
        const existRole = await this.roleDeptRepository.findOne({
            where: {
                roleDepartmentID: id,
            }
        });
        return existRole;
    }
}
