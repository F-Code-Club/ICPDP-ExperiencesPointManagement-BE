import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Departments } from './departments.entity';
import { DepartmentsDto } from 'src/dto/departments.dto';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enum/roles/role.enum';
import { DeptsFilterDto } from './dto/department-filter.dto';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Departments)
        private deptsRepository: Repository<Departments>,
        private readonly usersService: UsersService,
    ) {};

    /*
    [GET]: /departments/page?&&take?
    */
    async getDepts(dto: DeptsFilterDto) {
        if (dto.page < 1) {
            throw new ForbiddenException('page must greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }
        return await this.deptsRepository.findAndCount({ relations: ['user'], take: dto.take, skip: dto.take*(dto.page - 1) });
    }

    /*
    [GET]: /departments/{id}
    */
    async getDeptById(id: string, userRole: string, userId: string): Promise<any> {
        const checkDept = await this.findById(id);

        if (!checkDept) {
            return null;
        }

        let checkRight = false;
        if ((userRole === Role.Dept && checkDept.user.userID === userId) || userRole === 'admin') {
            checkRight = true;
        }

        if (!checkRight) {
            throw new ForbiddenException('You have no right');
        }
        const checkUser = checkDept.user;
        const responseUser = {
            userId: checkUser.userID,
            username: checkUser.username,
            email: checkUser.email,
            role: checkUser.role
        }
        
        return {
            departmentID: checkDept.departmentID,
            name: checkDept.name,
            avt: checkDept.avt,
            user: responseUser
        };
    }

    /*
    [POST]: /departments/
    */
    async createDepts(deptsDto: DepartmentsDto, users: Users): Promise<Departments | null> {
        if (!deptsDto.name || deptsDto.name === "") {
            return null;
        }

        deptsDto.user = users;

        const newDepts = this.deptsRepository.create(deptsDto);

        if (!newDepts.avt) {
            newDepts.avt = "";
        }

        const savedDepts = await this.deptsRepository.save(newDepts);

        return  {
            departmentID: savedDepts.departmentID,
            name: savedDepts.name,
            avt: savedDepts.avt,
            user: savedDepts.user
        };
    }

    /* 
    [DELETE]: /departments/{ID}
    */
    async deleteDepts(id: string): Promise<Number | null> {
        const checkDept = await this.findById(id);
        if (!checkDept) {
            return null;
        }
        const resDept = await this.deptsRepository.delete(id);
        const resUser = await this.usersService.deleteUser(checkDept.user.userID);
        return resUser;
    }

    async findByName(name: string): Promise<Departments | null> {
        const existDepts = await this.deptsRepository.findOne({
            where: {
                name: name,
            }
        });
        return existDepts;
    }

    async findById(id: string): Promise<Departments | null> {
        const existClb = await this.deptsRepository.findOne({
            where: {
                departmentID: id,
            },
            relations: ['user']
        });
        return existClb;
    }
}
