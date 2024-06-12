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
      

        if (!userDto.avatar) {
            userDto.avatar = '';
        }

        userDto.refreshToken = "";

        const responseUser: Users = await this.userRepository.save(userDto);
        const responseData: Users = {
            userID: responseUser.userID,
            username: responseUser.username,
            password: responseUser.password,
            email: responseUser.email,
            role: responseUser.role,
            avatar: responseUser.avatar
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

    async updateEmail(userId: string, newEmail: string): Promise<Users | null> {
        const checkUser = await this.findById(userId);
        if (!checkUser) {
            return null;
        }

        const emailExist = await this.findByEmail(newEmail);
        if (emailExist && emailExist.userID !== userId) {
            throw new ForbiddenException('This email is already exist');
        }

        checkUser.email = newEmail;

        const responseUser = await this.userRepository.save(checkUser);

        return responseUser;
    }

    async updatePasswordByAdmin(userId: string, newPassword: string): Promise<Users | null> {
        const checkUser = await this.findById(userId);
        if(!checkUser) {
            return null;
        }

        const key = (await promisify(scrypt)(newPassword, 'salt', 32)) as Buffer;
        const cipher = createCipheriv('aes-256-ctr', key, Buffer.from(checkUser.iv, 'hex'));
        let encryptedText = cipher.update(newPassword, 'utf8', 'hex');
        encryptedText += cipher.final('hex');
        checkUser.password = encryptedText;

        const responseUser = await this.userRepository.save(checkUser);

        return responseUser;
    }

    async updatePasswordByUser(userId: string, oldPassword: string, newPassword: string): Promise<Users | null> {
        const checkUser = await this.findById(userId);
        if (!checkUser) {
            return null;
        }

        const checkOld = oldPassword;
        const checkNew = newPassword;

        // encode oldPassword
        const key = (await promisify(scrypt)(oldPassword, 'salt', 32)) as Buffer;
        const cipher = createCipheriv('aes-256-ctr', key, Buffer.from(checkUser.iv, 'hex'));
        let encryptedText = cipher.update(oldPassword, 'utf8', 'hex');
        encryptedText += cipher.final('hex');
        oldPassword = encryptedText;

        //encode newPassword
        const key2 = (await promisify(scrypt)(newPassword, 'salt', 32)) as Buffer;
        const cipher2 = createCipheriv('aes-256-ctr', key2, Buffer.from(checkUser.iv, 'hex'));
        let encryptedText2 = cipher2.update(newPassword, 'utf8', 'hex');
        encryptedText2 += cipher2.final('hex');
        newPassword= encryptedText2;

        if (checkOld === checkNew) {
            throw new ForbiddenException('The New password must different from the Old password');
        }

        if (checkUser.password === oldPassword) {
            checkUser.password = newPassword;

            const responseUser = await this.userRepository.save(checkUser);

            await this.deleteRefreshToken(responseUser.userID);

            return responseUser;
        } else {
            throw new ForbiddenException('Old password is not valid');
        }
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
                userID: userId
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

    async deleteUser(userId: string): Promise<Number | null> {
        const checkUser = await this.findById(userId);
        if (!checkUser) {
            return null;
        }
        const res = await this.userRepository.delete(userId);
        return res.affected;
    }

}
