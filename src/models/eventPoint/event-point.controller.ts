import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { EventPointService } from './event-point.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { EventPointCreateRequestDto } from './dto/event-point-create-request.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { EventPointFilterDto } from './dto/event-point-filter.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';
import { EventPointResponseDto } from './dto/event-point-response.dto';
import { Response } from 'express';
import { EventPointUpdateRequestDto } from './dto/event-point-update-request.dto';
import { UploadFileDto } from 'src/local-files/dto/upload-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalFilesService } from 'src/local-files/local-files.service';

@ApiTags('EventPoint')
@Controller('event-point')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EventPointController {
    constructor (
        private readonly eventPointService: EventPointService,
        private readonly localFilesService: LocalFilesService,
    ) {};

    @Get('/:eventID')
    async getStudents (@Request() req, @Param('eventID') id: string, @Query() filter: EventPointFilterDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [students, count] = await this.eventPointService.getStudents(filter, id, req.user.role, req.user.userID);
        let message = 'Get students successfully';
        if (!students || count == 0) {  
            message = 'Get students fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(students, EventPointResponseDto), filter, count, message);
    }

    @Roles(Role.Clb, Role.Dept)
    @Post('/:eventID')
    async addStudents (@Request() req, @Body() addStudentDto: EventPointCreateRequestDto, @Param('eventID') id: string) {
        const responseData = await this.eventPointService.addStudents(id, addStudentDto, req.user.role, req.user.userID, req.user.organizationID);
        return new ApiResponseDto(responseData, 'Add student successfully');
    }

    @Roles(Role.Clb)
    @Post('/:eventID/import')
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        type: UploadFileDto
    })
    @UseInterceptors(FileInterceptor("file"))
    async importStudentsFromExcel (@Request() req, @Param('eventID') eventID: string, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        const infoExcelFile = await this.localFilesService.createExcelFile(file.filename, file.path);
        const readExcelFile = await this.localFilesService.readExcelFileForImportToEventPoint(infoExcelFile.localFileID);
        const responseData = await this.eventPointService.importStudents(eventID, readExcelFile, req.user.role, req.user.userID, req.user.organizationID);
        return res.status(201).json(new ApiResponseDto(responseData, 'Import member to club successfully'));
    }

    @Roles(Role.Clb, Role.Dept)
    @Patch('/:eventID&:studentID')
    async updateStudents (@Request() req, @Body() updateDto: EventPointUpdateRequestDto, @Param('eventID') eventID: string, @Param('studentID') studentIDFromParam: string, @Res() res: Response) {
        const responseData = await this.eventPointService.updateStudents(eventID, studentIDFromParam, updateDto, req.user.role, req.user.userID, req.user.organizationID);
        if (responseData === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Update student on this event successfully'));
        }
    }

    @Roles(Role.Clb, Role.Dept)
    @Delete('/:eventID&:studentID')
    async deleteStudents (@Request() req, @Param('eventID') eventID: string, @Param('studentID') studentID: string, @Res() res: Response) {
        const responseData = await this.eventPointService.deleteStudents(eventID, studentID, req.user.role, req.user.userID, req.user.organizationID);
        if (responseData === 0) {
            return res.status(400).json(new ApiResponseDto(null, 'Delete student fail'));
        } else {
            return res.status(200).json(new ApiResponseDto(null, 'Delete student successfully'));
        }
    }
}
