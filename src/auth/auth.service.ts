import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/models/users/users.service';
import { Tokens } from './type/Tokens.type';
import { JwtPayload } from './type/jwtPayload.type';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {};

    async signIn(username: string, password: string): Promise<Tokens> {
        const user = await this.usersService.checkLogin(username, password);
        if (user == null) {
            throw new  UnauthorizedException();
        }
        const token: Tokens = await this.getTokens(user.id, user.username, user.role);
        return token;
    }

    async getTokens(userId: string, username: string, role: string): Promise<Tokens> {
        const payload: JwtPayload = {
            sub: userId,
            username: username,
            role: role
        };

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
            access_token: at,
            refresh_token: rt
        };
    }

    async refreshToken(refreshToken: string): Promise<Tokens> {
        try {
            const payload: JwtPayload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_RT_SECRET,
            });
            const user = await this.usersService.findById(payload.sub);

            if (!user) {
                throw new UnauthorizedException();
            }
            const tokens = await this.getTokens(user.id, user.username, user.role);

            return tokens;
        } catch(e) {
            throw new UnauthorizedException();
        }
    }
}
