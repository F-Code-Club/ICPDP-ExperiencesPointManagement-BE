import { Body, Controller, Delete, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleClbsService } from './role-clbs.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { RoleClbsDto } from 'src/dto/roleClbs.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { UpdateRoleClubDto } from './dto/role-clbs-update-request.dto';
import { Response } from 'express';

@ApiTags('RoleClubs')
@Controller('roleclubs')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RoleClbsController {
    constructor (
        private readonly roleClubsService: RoleClbsService,
    ) {};

    @Roles(Role.Admin)
    @Post()
    async addRoleClub (@Body() roleClubDto: RoleClbsDto) {
        const responseData = await this.roleClubsService.addRoleClub(roleClubDto);
        return new ApiResponseDto(responseData, 'Add role for club successfully');
    }

    @Roles(Role.Admin)
    @Patch('/:ID')
    async updateRoleClub (@Param('ID') id: string, @Body() updateDto: UpdateRoleClubDto, @Res() res: Response) {
        const responseData = await this.roleClubsService.updateRoleClub(id, updateDto);
        if (responseData === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Update role club successfully'));
        }
    }

    @Roles(Role.Admin)
    @Delete('/:ID')
    async deleteRoleClub (@Param('ID') id: string, @Res() res: Response) {
        const responseData = await this.roleClubsService.deleteRoleClub(id);
        if (responseData === null) {
            return res.status(404).json(new ApiResponseDto(null, 'Role club not found'));
        } else if (responseData === 0) {
            return res.status(400).json(new ApiResponseDto(null, 'Delete fail'));
        } else {
            return res.status(201).json(new ApiResponseDto(null, 'Delete successfully'));
        }
    }
}
