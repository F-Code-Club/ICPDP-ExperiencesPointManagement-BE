import { Body, Controller, Param, Patch, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ClubMemberService } from './club-member.service';
import { AddClubMemberDto } from './dto/club-meber-post-request.dto';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { UpdateClubMemberDto } from './dto/club-member-patch-request.dto';
import { Response } from 'express';

@ApiTags('ClubMember')
@Controller('club-member')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ClubMemberController {
    constructor (
        private readonly clubMemberService: ClubMemberService,
    ) {};

    @Roles(Role.Clb)
    @Post('/:clubID')
    async addClubMember (@Request() req, @Body() dto: AddClubMemberDto) {        
        const responseData = await this.clubMemberService.addMember(req.user.organizationID, dto);
        return new ApiResponseDto(responseData, 'Add member to club successfully');
    }

    @Roles(Role.Clb)
    @Patch('/:clubID&:studentID')
    async updateClubMember (@Request() req, @Body() dto: UpdateClubMemberDto, @Param('studentID') studentID: string, @Res() res: Response) {
        const responseData = await this.clubMemberService.updateClubMember(req.user.organizationID, dto, studentID);
        if (responseData === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Update member on this club successfully'));
        }
    }
}
