import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
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
import { DeptsFilterDto } from './dto/department-filter.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';
import { DeptsResponseDto } from './dto/department-response.dto';
import { UpdateDeptRequestDto } from './dto/department-update-request.dto';

@ApiTags('Departments')
@Controller('departments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DepartmentsController {
    constructor (
        private readonly deptService: DepartmentsService,
        private readonly usersService: UsersService,
    ) {};
    
    @Roles(Role.Admin)
    @Get()
    async getDepts(@Query() filter: DeptsFilterDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [deparments, count] = await this.deptService.getDepts(filter);
        let message = 'Get departments successfully';
        if (!deparments || count === 0) {
            message = 'Get departments fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(deparments, DeptsResponseDto), filter, count, message);
    }

    @Roles(Role.Admin, Role.Dept)
    @Get('/:ID')
    async getDeptById(@Request() req, @Param('ID') id: string, @Res() res: Response) {
        const responseDept = await this.deptService.getDeptById(id, req.user.role, req.user.userID);
        if (!responseDept) {
            return res.status(404).json(new ApiResponseDto(null, 'Department Not Found'));
        }
        const responseData = {
            userID: responseDept.user.userID,
            username: responseDept.user.username,
            password: responseDept.user.password,
            email: responseDept.user.email,
            role: responseDept.user.role,
            departmentID: responseDept.departmentID,
            name: responseDept.name,
            avatar: responseDept.avatar,
            active: responseDept.active
        }      
        return res.status(200).json(new ApiResponseDto(responseData, 'Get department successfully'));
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
        depsDto.avatar = createDeptRequestDto.avatar;

        if (usersDto.role !== Role.Dept) {
            return res.status(403).json(new ApiResponseDto(null, 'This account role is incorrect'));
        }
        if (await this.deptService.findByName(depsDto.name)) {
            return res.status(403).json(new ApiResponseDto(null, 'This department name was taken'));
        }
        if (await this.usersService.checkExist(usersDto.username, usersDto.email)) {
            return;
        }
        const responseUser = await this.usersService.createUser(usersDto);
        const responseDepts = await this.deptService.createDepts(depsDto, responseUser);

        const responseData = {
            userID: responseUser.userID,
            username: responseUser.username,
            password: responseUser.password,
            email: responseUser.email,
            role: responseUser.role,
            departmentID: responseDepts.departmentID,
            name: responseDepts.name,
            avatar: responseDepts.avatar,
            active: responseDepts.active
        };

        if (responseDepts === null) {
            return res.status(400).json(new ApiResponseDto(null, 'Create department fail'));
        } else {
            return res.status(201).json(new ApiResponseDto(responseData, 'Create department successfully'));
        }
    }

    @Roles(Role.Admin, Role.Dept)
    @Patch('/:ID')
    async updateClb(@Request() req, @Body() deptDto: UpdateDeptRequestDto, @Param('ID') id: string, @Res() res: Response) {
        const responseDept = await this.deptService.updateDepts(deptDto, id, req.user.role, req.user.userID);
        if (responseDept === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        }
        if (!responseDept) {
            return res.status(404).json(new ApiResponseDto(null, 'Department Not Found'));
        }
        const responseData = {
            userID: responseDept.user.userID,
            username: responseDept.user.username,
            password: responseDept.user.password,
            email: responseDept.user.email,
            role: responseDept.user.role,
            departmentID: responseDept.departmentID,
            name: responseDept.name,
            avatar: responseDept.avatar,
            active: responseDept.active
        } 
        return res.status(201).json(new ApiResponseDto(responseData, 'Update department successfully'));
    }

    @Roles(Role.Admin)
    @Delete('/:ID')
    async deleteDept(@Param('ID') id: string, @Res() res: Response) {
        const resultDelete = await this.deptService.deleteDepts(id);
        if (resultDelete === null) {
            return res.status(404).json(new ApiResponseDto(null, 'Department not found'));
        } else if (resultDelete === 0) {
            return res.status(400).json(new ApiResponseDto(null, 'Delete fail'));
        } else {
            return res.status(200).json(new ApiResponseDto(null, 'Delete successfully'));
        }
    }
}
