import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleClbsService } from './role-clbs.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { RoleClbsDto } from 'src/dto/roleClbs.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';

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
}
