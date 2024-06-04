import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clbs } from './clbs.entity';
import { Repository } from 'typeorm';
import { ClbsDto } from 'src/dto/clbs.dto';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { ClbsFilterDto } from './dto/club-filter.dto';
import { emitWarning } from 'process';

@Injectable()
export class ClbsService {
    constructor (
        @InjectRepository(Clbs)
        private clbsRepository: Repository<Clbs>,
        private readonly usersService: UsersService,
    ) {};

    /*
    [GET]: /clubs/page?&&take?
    */
    async getClubs(dto: ClbsFilterDto) {
        if (dto.page < 1 || dto.take < 1) {
            throw new ForbiddenException('page and take must greater than or equal to 1');
        }
        return await this.clbsRepository.findAndCount({ relations: ['user'], take: dto.take, skip: dto.take*(dto.page - 1) });
    }


    /*
    [GET]: /clubs/{id}
    */
    async getClubById(id: string, userRole: string, userId: string): Promise<any> {
        const checkClub = await this.findById(id);

        if (!checkClub) {
            return null;
        }
        
        let checkRight = false;
        if ((userRole === 'club' && checkClub.user.userID === userId) || userRole === 'admin') {
            checkRight = true;
        }

        if (!checkRight) {
            throw new ForbiddenException('You have no right');
        }
        const checkUser = checkClub.user;
        const responseUser = {
            userId: checkUser.userID,
            username: checkUser.username,
            email: checkUser.email,
            role: checkUser.role
        }
        
        return {
            clubId: checkClub.clubId,
            name: checkClub.name,
            avt: checkClub.avt,
            user: responseUser
        };
    }

    /*
    [POST]: /clubs/
    */
    async createClbs(clbsDto: ClbsDto, users: Users): Promise<Clbs | null> {
        if (!clbsDto.name || clbsDto.name === "") {
            return null;
        }

        clbsDto.user = users;

        const newClbs = this.clbsRepository.create(clbsDto);

        if (!newClbs.avt) {
            newClbs.avt = 'not set avt yet';
        }

        const savedClbs = await this.clbsRepository.save(newClbs);

        return {
            clubId: savedClbs.clubId,
            name: savedClbs.name,
            avt: savedClbs.avt,
            user: savedClbs.user
        }
    }

    /*
    [PUT]: /clubs/{id}
    */
    async updateClbs(clbsDto: ClbsDto, id: string, userRole: string, userId: string): Promise<any> {
        const clb = await this.findById(id);
        
        if (!clb) {
            return null;
        }

        let checkRight = false;

        if ((userRole === 'club' && clb.user.userID === userId) || userRole === 'admin') {
            checkRight = true;
        }

        if (checkRight) {
            let isChanged = false;
            
            const checkExist = await this.findByName(clbsDto.name);

            if (checkExist !== null && checkExist.clubId !== id) {
                throw new ForbiddenException('This name was taken');
            }

            if (clbsDto.avt && clbsDto.avt !== clb.avt) {
                clb.avt = clbsDto.avt;
                isChanged = true;
            }

            if (clbsDto.name && clbsDto.name !== clb.name) {
                clb.name = clbsDto.name;
                isChanged = true;
            }

            if (!isChanged) {
                return 'Nothing changed';
            }

            const updatedClb = await this.clbsRepository.save(clb);

            const checkUser = updatedClb.user;
            const responseUser = {
                userId: checkUser.userID,
                username: checkUser.username,
                email: checkUser.email,
                role: checkUser.role
            }

            return {
                clubId: updatedClb.clubId,
                name: updatedClb.name,
                avt: updatedClb.avt,
                user: responseUser
            };
        } else {
            throw new ForbiddenException('You have no right to update');
        }
    }

    /*
    [DELETE]: /clubs/{id}
    */
    async deleteClbs(id: string): Promise<Number | null> {
        const checkClb = await this.findById(id);
        if (!checkClb) {
            return null;
        }
        const resClub = await this.clbsRepository.delete(id);
        const resUser = await this.usersService.deleteUser(checkClb.user.userID);
        return resUser;
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
                clubId: id,
            },
            relations: ['user']
        });
        return existClb;
    }
}