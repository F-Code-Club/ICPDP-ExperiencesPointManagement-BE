import { ForbiddenException, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Departments } from './departments.entity';
import { DepartmentsDto } from 'src/dto/departments.dto';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enum/roles/role.enum';
import { DeptsFilterDto } from './dto/department-filter.dto';
import { UpdateDeptRequestDto } from './dto/department-update-request.dto';
import { promisify } from 'util';
import { createCipheriv, scrypt } from 'crypto';
import { Events } from '../event/event.entity';
import { EventPoint } from '../eventPoint/event-point.entity';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Departments)
        private deptsRepository: Repository<Departments>,
        @InjectRepository(Events)
        private eventsRepository: Repository<Events>,
        @InjectRepository(EventPoint)
        private eventPointRepository: Repository<EventPoint>,
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

        const searchCondition = dto.searchValue ? { name: Like(`%${dto.searchValue}%`) } : {};

        return await this.deptsRepository.findAndCount({ 
            relations: ['user'], 
            take: dto.take, 
            skip: dto.take*(dto.page - 1),
            where: searchCondition,
            order: { 
                [dto.orderBy]: dto.order
            } 
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
            password: checkUser.password,
            email: checkUser.email,
            role: checkUser.role
        }
        
        return {
            departmentID: checkDept.departmentID,
            name: checkDept.name,
            avatar: checkDept.avatar,
            active: checkDept.active,
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
            active: savedDepts.active,
            user: savedDepts.user
        };
    }

    /* 
    [PUT]: /departments/{ID}
    */
    async updateDepts(deptsDto: UpdateDeptRequestDto, id: string, userRole: string, userId: string): Promise<any> {
        const dept = await this.findById(id);
        
        if (!dept) {
            return null;
        }

        let checkRight = false;

        if ((userRole === Role.Dept && dept.user.userID === userId) || userRole === Role.Admin) {
            checkRight = true;
        }

        if (checkRight) {
            let isChanged = false;
            
            const checkExist = await this.findByName(deptsDto.name);

            if (deptsDto.name && checkExist && checkExist.departmentID !== id) {
                throw new ForbiddenException('This department name was taken');
            }

            if (deptsDto.avatar && deptsDto.avatar !== dept.avatar) {
                dept.avatar = deptsDto.avatar;
                isChanged = true;
            }

            if (deptsDto.active !== undefined && deptsDto.active !== dept.active) {
                dept.active = deptsDto.active;
                isChanged = true;
            }   

            if (deptsDto.name && deptsDto.name !== dept.name) {
                dept.name = deptsDto.name;
                isChanged = true;
            }

            if (deptsDto.username && dept.user.username !== deptsDto.username) {
                const updatedUsername = await this.usersService.updateUsername(dept.user.userID, deptsDto.username);
                dept.user.username = updatedUsername.username;
                isChanged = true;
            }

            if (deptsDto.email && dept.user.email !== deptsDto.email) {
                const updatedEmail = await this.usersService.updateEmail(dept.user.userID, deptsDto.email);
                dept.user.email = updatedEmail.email;
                isChanged = true;
            }

            if (userRole !== Role.Admin && deptsDto.password) {
                throw new ForbiddenException('You have no right to update password here');
            } else if (userRole === Role.Admin && deptsDto.password) {
                if (deptsDto.password !== dept.user.password) {
                    // encode password to test
                    let checkPass = deptsDto.password;
                    const key = (await promisify(scrypt)(checkPass, 'salt', 32)) as Buffer;
                    const cipher = createCipheriv('aes-256-ctr', key, Buffer.from(dept.user.iv, 'hex'));
                    let encryptedText = cipher.update(checkPass, 'utf8', 'hex');
                    encryptedText += cipher.final('hex');
                    checkPass = encryptedText;

                    // check password here
                    if (checkPass !== dept.user.password) {
                        const updatedPassword = await this.usersService.updatePasswordByAdmin(dept.user.userID, deptsDto.password);
                        dept.user.password = updatedPassword.password;
                        isChanged = true;
                    }
                }
            }

            if (!isChanged) {
                return 'Nothing changed';
            }

            const updatedDept = await this.deptsRepository.save(dept);

            const checkUser = updatedDept.user;
            const responseUser = {
                userID: checkUser.userID,
                username: checkUser.username,
                password: checkUser.password,
                email: checkUser.email,
                role: checkUser.role
            }
            
            return {
                departmentID: updatedDept.departmentID,
                name: updatedDept.name,
                avatar: updatedDept.avatar,
                active: updatedDept.active,
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

        const existEvents = await this.eventsRepository.find({
            where: {
                department: {
                    departmentID: id
                }
            }
        });

        for (const event of existEvents) {
            await this.eventPointRepository.delete({
                event: {
                    eventID: event.eventID
                }
            });
            await this.eventsRepository.delete({
                eventID: event.eventID
            });
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
        const existDepts = await this.deptsRepository.findOne({
            where: {
                departmentID: id,
            },
            relations: ['user']
        });
        return existDepts;
    }

    async findByUserId(userId: string): Promise<Departments | null> {
        const existDepts = await this.deptsRepository.findOne({
            where: {
                user: {
                    userID: userId
                },
            },
            relations: ['user']
        });
        return existDepts;
    }
}
