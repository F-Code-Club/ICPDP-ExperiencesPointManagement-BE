import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ClubMemberService } from './club-member.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { UpdateClubMemberDto } from './dto/club-member-patch-request.dto';
import { Response } from 'express';
import { GetClubMemberDto } from './dto/club-member-get-request.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';
import { ClubMemberResponseDto } from './dto/club-member-response.dto';
import { UploadFileDto } from 'src/local-files/dto/upload-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalFilesService } from 'src/local-files/local-files.service';
import { AddMemberDto } from 'src/dto/addMember.dto';

@ApiTags('ClubMember')
@Controller('club-member')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ClubMemberController {
    constructor (
        private readonly clubMemberService: ClubMemberService,
        private readonly localFilesService: LocalFilesService,
    ) {};

    @Roles(Role.Clb)
    @Get()
    async getClubMember (@Request() req, @Query() filter: GetClubMemberDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [members, count] = await this.clubMemberService.getClubMember(req.user.organizationID, filter);
        let message = 'Get members successfully';
        if (!members || count == 0) {  
            message = 'Get members fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(members, ClubMemberResponseDto), filter, count, message);
    }

    @Roles(Role.Clb)
    @Post()
    async addClubMember (@Request() req, @Body() dto: AddMemberDto) {        
        const responseData = await this.clubMemberService.addMember(req.user.organizationID, dto);
        return new ApiResponseDto(responseData, 'Add member to club successfully');
    }

    @Roles(Role.Clb)
    @Post('/import')
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        type: UploadFileDto
    })
    @UseInterceptors(FileInterceptor("file"))
    async importStudentsFromExcel (@Request() req, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        const infoExcelFile = await this.localFilesService.createExcelFile(file.filename, file.path);
        const readExcelFile = await this.localFilesService.readExcelFileForImportMember(infoExcelFile.localFileID);
        const responseData = await this.clubMemberService.importStudentsFromExcel(readExcelFile, req.user.organizationID);
        return res.status(201).json(new ApiResponseDto(responseData, 'Import member to club successfully'));
    }

    @Roles(Role.Clb)
    @Patch('/:studentID')
    async updateClubMember (@Request() req, @Body() dto: UpdateClubMemberDto, @Param('studentID') studentID: string, @Res() res: Response) {
        const responseData = await this.clubMemberService.updateClubMember(req.user.organizationID, dto, studentID);
        if (responseData === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Update member on this club successfully'));
        }
    }

    @Roles(Role.Clb)
    @Delete('/:studentID')
    async deleteClubMember (@Request() req, @Param('studentID') studentID: string, @Res() res: Response) {
        const responseData = await this.clubMemberService.deleteClubMember(req.user.organizationID, studentID);
        if (!responseData) {
            return res.status(400).json(new ApiResponseDto(null, 'Delete member fail'));
        } else {
            return res.status(200).json(new ApiResponseDto(null, 'Delete member successfully'));
        }
    }
}
