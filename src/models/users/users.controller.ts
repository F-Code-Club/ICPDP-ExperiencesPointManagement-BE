import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UsersDto } from 'src/dto/users.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { Response } from 'express';
import { ApiResponseDto, SwaggerApiResponse } from 'src/utils/api-response.dto';
import { ResponseRegisterUserDto } from './response/response.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {};

    @Public()
    @Post('/register')
    @ApiResponse({
        status: 201,
        description: 'Register successfully',
        type: ResponseRegisterUserDto
    })
    async register(@Body(new ValidationPipe) userDto: UsersDto, @Res() res: Response){
        const checkUser = await this.usersService.createUser(userDto);
        if (checkUser === null) {
            return res.status(403).json(new ApiResponseDto(checkUser, 'This username was taken'));
        } else {
            return res.status(201).json(new ApiResponseDto(checkUser, 'Register successfully'));
        }
    }
}
