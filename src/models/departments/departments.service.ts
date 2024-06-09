import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Departments } from './departments.entity';
import { DepartmentsDto } from 'src/dto/departments.dto';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enum/roles/role.enum';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Departments)
        private deptsRepository: Repository<Departments>,
        private readonly usersService: UsersService,
    ) {};

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
