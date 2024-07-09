import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleDepartmentsService } from './role-departments.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { RoleDepartmentsDto } from 'src/dto/roleDepartments.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { response } from 'express';

@ApiTags('RoleDepartments')
@Controller('roledepartments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RoleDepartmentsController {
    constructor (
        private readonly roleDepartmentsService: RoleDepartmentsService,
    ) {};

    @Roles(Role.Admin)
    @Post()
    async addRoleDepartment (@Body() roleDepartmentDto: RoleDepartmentsDto) {
        const responseData = await this.roleDepartmentsService.addRoleDepartment(roleDepartmentDto);
        return new ApiResponseDto(responseData, 'Add role for department successfully');
    }
}
