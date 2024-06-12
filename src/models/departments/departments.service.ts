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
        return await this.deptsRepository.findAndCount({ 
            relations: ['user'], 
            take: dto.take, 
            skip: dto.take*(dto.page - 1),
            order: { createdAt: 'ASC' } 
        });
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
            userID: checkUser.userID,
            username: checkUser.username,
            email: checkUser.email,
            role: checkUser.role
        }
        
        return {
            departmentID: checkDept.departmentID,
            name: checkDept.name,
            avatar: checkDept.avatar,
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

        if (!newDepts.avatar) {
            newDepts.avatar = "";
        }

        const savedDepts = await this.deptsRepository.save(newDepts);

        return  {
            departmentID: savedDepts.departmentID,
            name: savedDepts.name,
            avatar: savedDepts.avatar,
            user: savedDepts.user
        };
    }

    /* 
    [PUT]: /departments/{ID}
    */
    async updateDepts(deptsDto: DepartmentsDto, id: string, userRole: string, userId: string): Promise<any> {
        const dept = await this.findById(id);
        
        if (!dept) {
            return null;
        }

        let checkRight = false;

        if ((userRole === Role.Dept && dept.user.userID === userId) || userRole === 'admin') {
            checkRight = true;
        }

        if (checkRight) {
            let isChanged = false;
            
            const checkExist = await this.findByName(deptsDto.name);

            if (checkExist !== null && checkExist.departmentID !== id) {
                throw new ForbiddenException('This name was taken');
            }

            if (deptsDto.avatar && deptsDto.avatar !== dept.avatar) {
                dept.avatar = deptsDto.avatar;
                isChanged = true;
            }

            if (deptsDto.name && deptsDto.name !== dept.name) {
                dept.name = deptsDto.name;
                isChanged = true;
            }

            if (!isChanged) {
                return 'Nothing changed';
            }

            const updatedDept = await this.deptsRepository.save(dept);

            const checkUser = updatedDept.user;
            const responseUser = {
                userID: checkUser.userID,
                username: checkUser.username,
                email: checkUser.email,
                role: checkUser.role
            }
            
            return {
                departmentID: updatedDept.departmentID,
                name: updatedDept.name,
                avatar: updatedDept.avatar,
                user: responseUser
            };
        } else {
            throw new ForbiddenException('You have no right to update');
        }
    }

    /* 
    [DELETE]: /departments/{ID}
    */
    async deleteDepts(id: string): Promise<Number | null> {
        const checkDept = await this.findById(id);
        if (!checkDept) {
            return null;
        }
        await this.deptsRepository.delete(id);
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
