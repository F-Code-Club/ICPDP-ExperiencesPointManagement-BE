import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ClubMemberService } from './club-member.service';
import { AddClubMemberDto } from './dto/club-meber-post-request.dto';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { ApiResponseDto } from 'src/utils/api-response.dto';

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
}
