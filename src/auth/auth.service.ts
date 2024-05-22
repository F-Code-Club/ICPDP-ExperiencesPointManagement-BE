import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/models/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {};

    async signIn(username: string, password: string): Promise<{ access_token: string }> {
        const user = await this.usersService.checkLogin(username, password);
        if (user == null) {
            throw new  UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.username, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
