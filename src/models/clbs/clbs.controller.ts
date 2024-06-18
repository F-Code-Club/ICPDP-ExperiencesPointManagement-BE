import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClbsService } from './clbs.service';
import { ClbsDto } from 'src/dto/clbs.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { Response } from 'express';
import { Role } from 'src/enum/roles/role.enum';
import { Roles } from 'src/enum/roles/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ForbiddenExceptionFilter } from 'src/utils/forbidden-exception.filter';    
import { UsersService } from '../users/users.service';
import { CreateClubRequestDto } from './dto/club-request.dto';
import { UsersDto } from 'src/dto/users.dto';
import { ClbsFilterDto } from './dto/club-filter.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';
import { ClbsResponseDto } from './dto/club-response.dto';
import { UpdateClubRequestDto } from './dto/club-update-request.dto';

@ApiTags('Clubs')
@Controller('clubs')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@UseFilters(ForbiddenExceptionFilter)
export class ClbsController {
    constructor (
        private readonly clbsService: ClbsService,
        private readonly usersService: UsersService,
    ) {};

    @Roles(Role.Admin)
    @Get()
    async getClubs(@Query() filter: ClbsFilterDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [clubs, count] = await this.clbsService.getClubs(filter);
        let message = 'Get clubs successfully';
        if (!clubs || count === 0) {
            message = 'Get clubs fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(clubs, ClbsResponseDto), filter, count, message);
    }

    @Roles(Role.Admin, Role.Clb)
    @Get('/:ID')
    async getClubById(@Request() req, @Param('ID') id: string, @Res() res: Response) {
        const responseClb = await this.clbsService.getClubById(id, req.user.role, req.user.userID);
        if (!responseClb) {
            return res.status(404).json(new ApiResponseDto(null, 'Clb Not Found'));
        }
        const responseData = {
            userID: responseClb.user.userID,
            username: responseClb.user.username,
            password: responseClb.user.password,
            email: responseClb.user.email,
            role: responseClb.user.role,
            clubID: responseClb.clubID,
            name: responseClb.name,
            avatar: responseClb.avatar,
            active: responseClb.active
        }      
        return res.status(200).json(new ApiResponseDto(responseData, 'Get club successfully'));
    }

    @Roles(Role.Admin)
    @Post()
    async createClub(@Body() createClubRequestDto: CreateClubRequestDto, @Res() res: Response) {
        let usersDto: UsersDto = new UsersDto();
        usersDto.username = createClubRequestDto.username;
        usersDto.email = createClubRequestDto.email;
        usersDto.password = createClubRequestDto.password;
        usersDto.role = createClubRequestDto.role;

        let clbsDto: ClbsDto = new ClbsDto();
        clbsDto.name = createClubRequestDto.name;
        clbsDto.avatar = createClubRequestDto.avatar;

        if (usersDto.role !== Role.Clb) {
            return res.status(403).json(new ApiResponseDto(null, 'This account role is incorrect'));
        }
        if (await this.clbsService.findByName(clbsDto.name)) {
            return res.status(403).json(new ApiResponseDto(null, 'This name was taken'));
        }
        if (await this.usersService.checkExist(usersDto.username, usersDto.email)) {
            return;
        }
        const responseUser = await this.usersService.createUser(usersDto);
        const responseClbs = await this.clbsService.createClbs(clbsDto, responseUser);

        const responseData = {
            userID: responseUser.userID,
            username: responseUser.username,
            password: responseUser.password,
            email: responseUser.email,
            role: responseUser.role,
            clubID: responseClbs.clubID,
            name: responseClbs.name,
            avatar: responseClbs.avatar,
            active: responseClbs.active
        };

        if (responseClbs === null) {
            return res.status(400).json(new ApiResponseDto(null, 'Create clb fail'));
        } else {
            return res.status(201).json(new ApiResponseDto(responseData, 'Create clb successfully'));
        }
    }

    @Roles(Role.Admin, Role.Clb)
    @Patch('/:ID')
    async updateClb(@Request() req, @Body() clbsDto: UpdateClubRequestDto, @Param('ID') id: string, @Res() res: Response) {
        const responseClb = await this.clbsService.updateClbs(clbsDto, id, req.user.role, req.user.userID);
        if (responseClb === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        }
        if (!responseClb) {
            return res.status(404).json(new ApiResponseDto(null, 'Club Not Found'));
        }
        const responseData = {
            userID: responseClb.user.userID,
            username: responseClb.user.username,
            password: responseClb.user.password,
            email: responseClb.user.email,
            role: responseClb.user.role,
            clubID: responseClb.clubID,
            name: responseClb.name,
            avatar: responseClb.avatar,
            active: responseClb.active
        } 
        return res.status(201).json(new ApiResponseDto(responseData, 'Update club successfully'));
    }

    @Roles(Role.Admin)
    @Delete('/:ID')
    async deleteClb(@Param('ID') id: string, @Res() res: Response) {
        const resultDelete = await this.clbsService.deleteClbs(id);
        if (resultDelete === null) {
            return res.status(404).json(new ApiResponseDto(null, 'Club not found'));
        } else if (resultDelete === 0) {
            return res.status(400).json(new ApiResponseDto(null, 'Delete fail'));
        } else {
            return res.status(201).json(new ApiResponseDto(null, 'Delete successfully'));
        }
    }
}
