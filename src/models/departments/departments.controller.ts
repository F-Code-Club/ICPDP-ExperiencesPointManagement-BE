import { Body, Controller, Get, Param, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DepartmentsService } from './departments.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { CreateDeptRequestDto } from './dto/departments-request.dto';
import { Response } from 'express';
import { UsersDto } from 'src/dto/users.dto';
import { DepartmentsDto } from 'src/dto/departments.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { UsersService } from '../users/users.service';

@ApiTags('Departments')
@Controller('departments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DepartmentsController {
    constructor (
        private readonly deptService: DepartmentsService,
        private readonly usersService: UsersService,
    ) {};

    @Roles(Role.Admin, Role.Dept)
    @Get('/:ID')
    async getDeptById(@Request() req, @Param('ID') id: string, @Res() res: Response) {
        const responseDept = await this.deptService.getDeptById(id, req.user.role, req.user.userId);
        if (!responseDept) {
            return res.status(404).json(new ApiResponseDto(null, 'Clb Not Found'));
        }
        const responseData = {
            userID: responseDept.user.userId,
            username: responseDept.user.username,
            email: responseDept.user.email,
            role: responseDept.user.role,
            departmentID: responseDept.clubId,
            name: responseDept.name,
            avt: responseDept.avt,
        }      
        return res.status(200).json(new ApiResponseDto(responseData, 'Get club successfully'));
    }

    @Roles(Role.Admin)
    @Post()
    async createDept(@Body() createDeptRequestDto: CreateDeptRequestDto, @Res() res: Response) {
        let usersDto: UsersDto = new UsersDto();
        usersDto.username = createDeptRequestDto.username;
        usersDto.email = createDeptRequestDto.email;
        usersDto.password = createDeptRequestDto.password;
        usersDto.role = createDeptRequestDto.role;

        let depsDto: DepartmentsDto = new DepartmentsDto();
        depsDto.name = createDeptRequestDto.name;

        if (usersDto.role !== Role.Dept) {
            return res.status(403).json(new ApiResponseDto(null, 'This account role is incorrect'));
        }
        if (await this.deptService.findByName(depsDto.name)) {
            return res.status(403).json(new ApiResponseDto(null, 'This name was taken'));
        }
        if (await this.usersService.checkExist(usersDto.username, usersDto.email)) {
            return;
        }
        const responseUser = await this.usersService.createUser(usersDto);
        const responseDepts = await this.deptService.createDepts(depsDto, responseUser);

        const responseData = {
            userID: responseUser.userID,
            username: responseUser.username,
            email: responseUser.email,
            role: responseUser.role,
            departmentID: responseDepts.departmentID,
            name: responseDepts.name,
            avt: responseDepts.avt
        };

        if (responseDepts === null) {
            return res.status(400).json(new ApiResponseDto(null, 'Create department fail'));
        } else {
            return res.status(201).json(new ApiResponseDto(responseData, 'Create department successfully'));
        }
    }
}
