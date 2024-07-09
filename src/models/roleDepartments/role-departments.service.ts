import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleDepartments } from './roleDepartments.entity';
import { Repository } from 'typeorm';
import { RoleDepartmentsDto } from 'src/dto/roleDepartments.dto';

@Injectable()
export class RoleDepartmentsService {
    constructor (
        @InjectRepository(RoleDepartments)
        private roleDeptRepository: Repository<RoleDepartments>
    ) {};

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
