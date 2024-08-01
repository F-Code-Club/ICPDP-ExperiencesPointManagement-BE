import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DepartmentMemberService } from './department-member.service';
import { Role } from 'src/enum/roles/role.enum';
import { Roles } from 'src/enum/roles/role.decorator';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { updateDepartmentMemberDto } from './dto/department-member-patch-request.dto';
import { Response } from 'express';
import { GetDepartmentMemberDto } from './dto/department-member-get-request.dto';
import { DepartmentMemberResponseDto } from './dto/department-member-response.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';
import { AddMemberDto } from 'src/dto/addMember.dto';
import { LocalFilesService } from 'src/local-files/local-files.service';
import { UploadFileDto } from 'src/local-files/dto/upload-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('DepartmentMember')
@Controller('department-member')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DepartmentMemberController {
    constructor (
        private readonly deptMemberService: DepartmentMemberService,
        private readonly localFilesService: LocalFilesService,
    ) {};

    @Roles(Role.Dept)
    @Get()
    async getDepartmentMember (@Request() req, @Query() filter: GetDepartmentMemberDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [members, count] = await this.deptMemberService.getDepartmentMember(req.user.organizationID, filter);
        let message = 'Get members successfully';
        if (!members || count == 0) {  
            message = 'Get members fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(members, DepartmentMemberResponseDto), filter, count, message);
    }

    @Roles(Role.Dept)
    @Post()
    async addDepartmentMember (@Request() req, @Body() dto: AddMemberDto) {
        const responseData = await this.deptMemberService.addDepartmentMember(req.user.organizationID, dto);
        return new ApiResponseDto(responseData, 'Add member to department successfully');
    }

    @Roles(Role.Dept)
    @Post('/import')
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        type: UploadFileDto
    })
    @UseInterceptors(FileInterceptor("file"))
    async importStudentsFromExcel (@Request() req, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        const infoExcelFile = await this.localFilesService.createExcelFile(file.filename, file.path);
        const readExcelFile = await this.localFilesService.readExcelFileForImportMember(infoExcelFile.localFileID);
        const responseData = await this.deptMemberService.importStudentsFromExcel(readExcelFile, req.user.organizationID);
        return res.status(201).json(new ApiResponseDto(responseData, 'Import member to club successfully'));
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

    @Roles(Role.Dept)
    @Delete('/:studentID')
    async deleteDepartmentMember (@Request() req, @Param('studentID') studentID: string, @Res() res: Response) {
        const responseData = await this.deptMemberService.deleteDepartmentMember(req.user.organizationID, studentID);
        if (!responseData) {
            return res.status(400).json(new ApiResponseDto(null, 'Delete member fail'));
        } else {
            return res.status(200).json(new ApiResponseDto(null, 'Delete member successfully'));
        }
    }
}
