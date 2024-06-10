import { Body, Controller, Patch, Post, Request, Res, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UsersDto } from 'src/dto/users.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { Response } from 'express';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { ResponseRegisterUserDto } from './response/response.dto';
import { UpdatePasswordDto } from './dto/users-update-password.dto';

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

    @Patch('/update-password')
    @ApiBearerAuth()
    async updatePassword(@Request() req, @Body() dto: UpdatePasswordDto, @Res() res: Response) {
        const checkUser = await this.usersService.updatePasswordByUser(req.user.userID, dto.oldPassword, dto.newPassword);
        
        const responseData = {
            userID: checkUser.userID,
            username: checkUser.username,
            email: checkUser.email,
            avt: checkUser.avt,
            role: checkUser.role
        }

        if (checkUser === null) {
            return res.status(404).json(new ApiResponseDto(null, 'User not found'));
        } else {
            return res.status(201).json(new ApiResponseDto(responseData, 'Update password successfully'));
        }
    }
}
