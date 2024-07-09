import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleDepartmentsService } from './role-departments.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { RoleDepartmentsDto } from 'src/dto/roleDepartments.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { Response } from 'express';
import { UpdateRoleDepartmentDto } from './dto/role-departments-update.dto';
import { RoleDepartmentFilterDto } from './dto/role-department-filter.dto';
import { RoleDepartmentResponseDto } from './dto/role-department-response.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';

@ApiTags('RoleDepartments')
@Controller('role-departments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RoleDepartmentsController {
    constructor (
        private readonly roleDepartmentsService: RoleDepartmentsService,
    ) {};

    @Roles(Role.Admin)
    @Get()
    async getRoleDepartment (@Query() filter: RoleDepartmentFilterDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [roleDepartments, count] = await this.roleDepartmentsService.getRoleDepartments(filter);
        let message = 'Get role club successfully';
        if (!roleDepartments || count === 0) {
            message = 'Get role club fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(roleDepartments, RoleDepartmentResponseDto), filter, count, message);
    }

    @Roles(Role.Admin)
    @Post()
    async addRoleDepartment (@Body() roleDepartmentDto: RoleDepartmentsDto) {
        const responseData = await this.roleDepartmentsService.addRoleDepartment(roleDepartmentDto);
        return new ApiResponseDto(responseData, 'Add role for department successfully');
    }

    @Roles(Role.Admin)
    @Patch('/:ID')
    async updateRoleDepartment (@Param('ID') id: string, @Body() updateDto: UpdateRoleDepartmentDto, @Res() res: Response) {
        const responseData = await this.roleDepartmentsService.updateRoleDepartment(id, updateDto);
        if (responseData === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Update role department successfully'));
        }
    }   

    @Roles(Role.Admin)
    @Delete('/:ID')
    async deleteRoleDepartment (@Param('ID') id: string, @Res() res: Response) {
        const responseData = await this.roleDepartmentsService.deleteRoleDepartment(id);
        if (responseData === null) {
            return res.status(404).json(new ApiResponseDto(null, 'Role department not found'));
        } else if (responseData === 0) {
            return res.status(400).json(new ApiResponseDto(null, 'Delete fail'));
        } else {
            return res.status(201).json(new ApiResponseDto(null, 'Delete successfully'));
        }
    }
}
