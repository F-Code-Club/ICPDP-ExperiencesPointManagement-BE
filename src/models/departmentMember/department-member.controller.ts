import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DepartmentMemberService } from './department-member.service';
import { Role } from 'src/enum/roles/role.enum';
import { Roles } from 'src/enum/roles/role.decorator';
import { AddDepartmentMemberDto } from './dto/department-member-post-request.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { updateDepartmentMemberDto } from './dto/department-member-patch-request.dto';
import { Response } from 'express';
import { GetDepartmentMemberDto } from './dto/department-member-get-request.dto';
import { DepartmentMemberResponseDto } from './dto/department-member-response.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';

@ApiTags('DepartmentMember')
@Controller('department-member')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DepartmentMemberController {
    constructor (
        private readonly deptMemberService: DepartmentMemberService,
    ) {};

    @Roles(Role.Dept)
    @Get()
    async getClubMember (@Request() req, @Query() filter: GetDepartmentMemberDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [members, count] = await this.deptMemberService.getClubMember(req.user.organizationID, filter);
        let message = 'Get members successfully';
        if (!members || count == 0) {  
            message = 'Get members fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(members, DepartmentMemberResponseDto), filter, count, message);
    }

    @Roles(Role.Dept)
    @Post()
    async addDepartmentMember (@Request() req, @Body() dto: AddDepartmentMemberDto) {
        const responseData = await this.deptMemberService.addDepartmentMember(req.user.organizationID, dto);
        return new ApiResponseDto(responseData, 'Add member to department successfully');
    }

    @Roles(Role.Dept)
    @Patch('/:studentID')
    async updateDepartmentMember (@Request() req, @Body() dto: updateDepartmentMemberDto, @Param('studentID') studentID: string, @Res() res: Response) {
        const responseData = await this.deptMemberService.updateDepartmentMember(req.user.organizationID, dto, studentID);
        if (responseData === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Update member on this department successfully'));
        }
    }
}
