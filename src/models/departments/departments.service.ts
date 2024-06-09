import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Departments } from './departments.entity';
import { DepartmentsDto } from 'src/dto/departments.dto';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Departments)
        private deptsRepository: Repository<Departments>,
        private readonly usersService: UsersService,
    ) {};

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
}
