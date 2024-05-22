import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UsersDto } from 'src/dto/users.dto';
import { ResponseData } from 'src/global/globalClass';
import { Public } from 'src/auth/decorator/public.decorator';

@ApiTags('User')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {};

    @Public()
    @Post('/register')
    async register(@Body(new ValidationPipe) userDto: UsersDto): Promise<ResponseData<UsersDto>> {
        const checkUser = await this.usersService.createUser(userDto);
        if (checkUser === null) {
            return new ResponseData<UsersDto>(null, 403, 'This username was taken!!!');
        } else {
            return new ResponseData<UsersDto>(checkUser, 201, 'Register successfully');
        }
    }
}
