import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { UsersDto } from 'src/dto/users.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {};

    @Public()
    @Post('login')
    signIn(@Body(new ValidationPipe()) userDto: UsersDto) {
        return this.authService.signIn(userDto.username, userDto.password);
    }

}
