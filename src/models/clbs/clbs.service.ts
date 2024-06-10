import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clbs } from './clbs.entity';
import { Repository } from 'typeorm';
import { ClbsDto } from 'src/dto/clbs.dto';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { ClbsFilterDto } from './dto/club-filter.dto';
import { Role } from 'src/enum/roles/role.enum';
import { promisify } from 'util';
import { createCipheriv, scrypt } from 'crypto';
import { UpdateClubRequestDto } from './dto/club-update-request.dto';

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
        if (dto.page < 1) {
            throw new ForbiddenException('page must greater than or equal to 1');
        }
        if (dto.take < 0) {
            throw new ForbiddenException('take must greater than or equal to 0');
        }
        return await this.clbsRepository.findAndCount({ 
            relations: ['user'], 
            take: dto.take, 
            skip: dto.take*(dto.page - 1),
            order: { createdAt: 'ASC' } 
        });
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
            userID: checkUser.userID,
            username: checkUser.username,
            email: checkUser.email,
            role: checkUser.role
        }
        
        return {
            clubID: checkClub.clubID,
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
            clubID: savedClbs.clubID,
            name: savedClbs.name,
            avt: savedClbs.avt,
            user: savedClbs.user
        }
    }

    /*
    [PATCH]: /clubs/{id}
    */
    async updateClbs(clbsDto: UpdateClubRequestDto, id: string, userRole: string, userId: string): Promise<any> {
        const clb = await this.findById(id);

        if (!clb) {
            return null;
        }

        let checkRight = false;

        if (userRole === Role.Admin || (userRole === Role.Clb && clb.user.userID === userId)) {
            checkRight = true;
        }

        if (checkRight) {
            let isChanged = false;
            
            const checkExist = await this.findByName(clbsDto.name);


            if (checkExist && checkExist.clubID !== id) {
                throw new ForbiddenException('This club name was taken');
            }

            if (clbsDto.avt && clbsDto.avt !== clb.avt) {
                clb.avt = clbsDto.avt;
                isChanged = true;
            }

            if (clbsDto.name && clbsDto.name !== clb.name) {
                clb.name = clbsDto.name;
                isChanged = true;
            }


            if (clbsDto.email && clb.user.email !== clbsDto.email) {
                const updatedEmail = await this.usersService.updateEmail(clb.user.userID, clbsDto.email);
                clb.user.email = updatedEmail.email;
                isChanged = true;
            }

            if (userRole !== Role.Admin && clbsDto.password) {
                throw new ForbiddenException('You have no right to update password here');
            } else if (userRole === Role.Admin && clbsDto.password) {

                // encode password to test
                let checkPass = clbsDto.password;
                const key = (await promisify(scrypt)(checkPass, 'salt', 32)) as Buffer;
                const cipher = createCipheriv('aes-256-ctr', key, Buffer.from(clb.user.iv, 'hex'));
                let encryptedText = cipher.update(checkPass, 'utf8', 'hex');
                encryptedText += cipher.final('hex');
                checkPass = encryptedText;
                
                // check password here
                if (checkPass !== clb.user.password) {
                    const updatedPassword = await this.usersService.updatePasswordByAdmin(clb.user.userID, clbsDto.password);
                    clb.user.password = updatedPassword.password;
                    isChanged = true;
                }
            }

            if (!isChanged) {
                return 'Nothing changed';
            }

            const updatedClb = await this.clbsRepository.save(clb);

            const checkUser = updatedClb.user;
            const responseUser = {
                userID: checkUser.userID,
                username: checkUser.username,
                email: checkUser.email,
                role: checkUser.role
            }
            
            return {
                clubID: updatedClb.clubID,
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
                clubID: id,
            },
            relations: ['user']
        });
        return existClb;
    }
}