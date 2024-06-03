import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clbs } from './clbs.entity';
import { Repository } from 'typeorm';
import { ClbsDto } from 'src/dto/clbs.dto';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ClbsService {
    constructor (
        @InjectRepository(Clbs)
        private clbsRepository: Repository<Clbs>,
        private readonly usersService: UsersService,
    ) {};

    /*
    [GET]: /clubs/
    */
    async getAllClubs() {
        return this.clbsRepository.find();
    }

    /*
    [GET]: /clubs/{id}
    */
    async getClubById(id: string, userRole: string, userId: string): Promise<Clbs | null> {
        const checkClub = await this.findById(id);

        if (!checkClub) {
            return null;
        }

        let checkRight = false;
        if ((userRole === 'clb' && checkClub.user.userId === userId) || userRole === 'admin') {
            checkRight = true;
        }

        if (!checkRight) {
            throw new ForbiddenException('You have no right');
        }

        return {
            clubId: checkClub.clubId,
            name: checkClub.name,
            avt: checkClub.avt
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
            avt: savedClbs.avt
        }
    }

    /*
    [PUT]: /clubs/{id}
    */
    async updateClbs(clbsDto: ClbsDto, id: string, userRole: string, userId: string): Promise<Clbs | null> {
        const clb = await this.findById(id);
        
        if (!clb) {
            return null;
        }

        let checkRight = false;

        if ((userRole === 'clb' && clb.user.userId === userId) || userRole === 'admin') {
            checkRight = true;
        }

        if (checkRight) {
            clb.avt = clbsDto.avt || clb.avt;
            clb.name = clbsDto.name || clb.name;

            const updatedClb = await this.clbsRepository.save(clb);

            return {
                clubId: updatedClb.clubId,
                name: updatedClb.name,
                avt: updatedClb.avt
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
        const resUser = await this.usersService.deleteUser(checkClb.user.userId);
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