import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { UsersDto } from 'src/dto/users.dto';
import { AuthGuard } from './auth.guard';
import { RefreshToken } from 'src/dto/refreshToken.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {};

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body(new ValidationPipe()) userDto: UsersDto) {
        return this.authService.signIn(userDto.username, userDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    async getProfile(@Request() req) {
        return req.user;
    }

    @Public()
    @Post('refresh')
    async refreshToken(@Body(new ValidationPipe()) refreshTokenDto: RefreshToken) {
        return await this.authService.refreshToken(refreshTokenDto.refreshToken);
    }
}
