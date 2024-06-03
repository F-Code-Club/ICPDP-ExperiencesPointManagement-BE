import { ForbiddenException, Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersDto } from 'src/dto/users.dto';

@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {};

    /*
    [POST]: Register
    */
    async createUser(userDto: UsersDto): Promise<Users | null> {
        const iv = randomBytes(16);
        const key = (await promisify(scrypt)(userDto.password, 'salt', 32)) as Buffer;
        const cipher = createCipheriv('aes-256-ctr', key, iv);
        let encryptedText = cipher.update(userDto.password, 'utf8', 'hex');
        encryptedText += cipher.final('hex');
        userDto.password = encryptedText;
        userDto.iv = iv.toString('hex');
        const checkUser = await this.userRepository.findOne({
            where: {
                username: userDto.username,
            }
        });
        if (checkUser) {
            return null;
        }
      

        if (!userDto.avt) {
            userDto.avt = 'not have avt yet';
        }

        userDto.refreshToken = "";

        const responseUser: Users = await this.userRepository.save(userDto);
        const responseData: Users = {
            id: responseUser.id,
            username: responseUser.username,
            email: responseUser.email,
            role: responseUser.role,
            avt: responseUser.avt
        };
        return responseData;
    }

    async checkLogin(username: string, password: string): Promise<Users | null> {
        const foundUser = await this.userRepository.findOne({
            where: {
                username: username,
            }
        });

        if (foundUser) {
            const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
            const decipher = createCipheriv('aes-256-ctr', key, Buffer.from(foundUser.iv, 'hex'));
            let decryptedText = decipher.update(foundUser.password, 'hex', 'utf8');
            decryptedText += decipher.final('utf8');
            if (decryptedText === password) {
                return foundUser;
            }
        }
        return null;
    }

    async saveRefreshToken(userId: string, refreshToken: string): Promise<Users | null> {
        const checkUser = await this.findById(userId);
        if (!checkUser) {
            return null;
        }
        checkUser.refreshToken = refreshToken;

        const responseUser = await this.userRepository.save(checkUser);

        return responseUser;
    }

    async deleteRefreshToken(userId: string) {
        const checkUser = await this.findById(userId);
        if (!checkUser) {
            return null;
        }
        checkUser.refreshToken = "";

        const responseUser = await this.userRepository.save(checkUser);

        return responseUser;
    }

    async checkExist(userName: string, email: string): Promise<boolean> {
        let check = false;
        const checkUserName = await this.findByUserName(userName);
        const checkEmail = await this.findByEmail(email);

        if (checkUserName) {
            throw new ForbiddenException('This username was taken');
            check = true;
        } else if (checkEmail) {
            throw new ForbiddenException('This email was taken');
            check = true;
        }
        return check;
    }

    async findById(userId: string): Promise<Users | null> {
        const res = await this.userRepository.findOne({
            where:  {
                id: userId
            }
        });

        return res;
    }

    async findByUserName(userName: string): Promise<Users | null> {
        const res = await this.userRepository.findOne({
            where:  {
                username: userName
            }
        });

        return res;
    }

    async findByEmail(email: string): Promise<Users | null> {
        const res = await this.userRepository.findOne({
            where:  {
                email: email
            }
        });

        return res;
    }

}
