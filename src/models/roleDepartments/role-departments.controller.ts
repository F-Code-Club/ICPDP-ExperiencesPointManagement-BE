import { Body, Controller, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleDepartmentsService } from './role-departments.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { RoleDepartmentsDto } from 'src/dto/roleDepartments.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { Response } from 'express';
import { UpdateRoleDepartmentDto } from './dto/role-departments-update.dto';

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
}
