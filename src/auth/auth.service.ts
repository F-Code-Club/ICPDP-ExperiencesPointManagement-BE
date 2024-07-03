import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/models/users/users.service';
import { Tokens } from './type/Tokens.type';
import { JwtPayload } from './type/jwtPayload.type';
import * as dotenv from 'dotenv';
import { ClbsService } from 'src/models/clbs/clbs.service';
import { Role } from 'src/enum/roles/role.enum';
import { DepartmentsService } from 'src/models/departments/departments.service';
dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private clbsService: ClbsService,
        private deptService: DepartmentsService,
    ) {};

    async signIn(username: string, password: string): Promise<Tokens> {
        const user = await this.usersService.checkLogin(username, password);
        if (user == null) {
            throw new  ForbiddenException('Incorrect username or password');
        }
        const token: Tokens = await this.getTokens(user.userID, user.username, user.role);

        await this.usersService.saveRefreshToken(user.userID, token.refreshToken);

        return token;
    }

    async logOut(userId: string) {
        await this.usersService.deleteRefreshToken(userId);
        return null;
    }

    async getTokens(userId: string, username: string, role: string): Promise<Tokens> {
        let checkOrganization = null;
        let organizationID: string = null;  
        let payload: JwtPayload = null; 

        if (role === Role.Clb) {
            checkOrganization = await this.clbsService.findByUserId(userId);
            
            organizationID = checkOrganization.clubID;

            payload = {
                userID: userId,
                username: username,
                role: role,
                organizationID: organizationID
            };
        } else if (role === Role.Dept) {
            checkOrganization = await this.deptService.findByUserId(userId);

            organizationID = checkOrganization.departmentID;

            payload = {
                userID: userId,
                username: username,
                role: role,
                organizationID: organizationID
            };
        } else {
            payload = {
                userID: userId,
                username: username,
                role: role
            };
        }
        

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_AT_SECRET,
                expiresIn: '30m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_RT_SECRET,
                expiresIn: '7d',
            })
        ]);

        return {
            accessToken: at,
            refreshToken: rt
        };
    }

    async refreshToken(refreshToken: string): Promise<Tokens> {
        try {
            const payload: JwtPayload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_RT_SECRET,
            });
            const user = await this.usersService.findById(payload.userID);

            if (!user) {
                throw new UnauthorizedException();
            }
            const tokens = await this.getTokens(user.userID, user.username, user.role);

            await this.usersService.saveRefreshToken(user.userID, tokens.refreshToken);

            return tokens;
        } catch(e) {
            throw new UnauthorizedException();
        }
    }
}
