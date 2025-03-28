import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { AuthGuard } from './auth.guard';
import { RefreshToken } from 'src/dto/refreshToken.dto';
import { Response } from 'express';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { SignInDto } from './signin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {};

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body(new ValidationPipe()) userDto: SignInDto, @Res() res: Response) {
        return res.status(200).json(new ApiResponseDto(await this.authService.signIn(userDto.username, userDto.password), 'Login successfully'));
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    async getProfile(@Request() req) {
        return new ApiResponseDto(req.user, 'Get profile successfully');
    }

    @Public()
    @Post('refresh')
    async refreshToken(@Body(new ValidationPipe()) refreshTokenDto: RefreshToken, @Res() res: Response) {
        return res.status(200).json(new ApiResponseDto(await this.authService.refreshToken(refreshTokenDto.refreshToken), 'Refresh successfully'));
    }

    @Get('logout')
    @ApiBearerAuth()
    async logOut(@Request() req, @Res() res: Response) {
        return res.status(200).json(new ApiResponseDto(await this.authService.logOut(req.user.sub), 'Log out successfully'));
    }
}
