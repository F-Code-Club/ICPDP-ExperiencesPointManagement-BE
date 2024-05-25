import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { UsersDto } from 'src/dto/users.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {};

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body(new ValidationPipe()) userDto: UsersDto) {
        return this.authService.signIn(userDto.username, userDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    getProfile(@Request() req) {
        return req.user;
    }

}
