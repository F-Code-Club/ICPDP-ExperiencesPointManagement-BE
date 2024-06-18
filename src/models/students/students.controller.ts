import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { StudentsService } from './students.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { StudentsDto } from 'src/dto/students.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { Response } from 'express';
import { UpdateStudentRequestDto } from './dto/students-update-request.dto';

@ApiTags('Students')
@Controller('students')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class StudentsController {
    constructor (
        private readonly studentsService: StudentsService,
    ) {};

    @Get('/:ID')
    async getStudentById(@Param('ID') id: string, @Res() res: Response) {
        const responseData = await this.studentsService.getStudentById(id);
        if (!responseData) {
            return res.status(404).json(new ApiResponseDto(responseData, 'Student Not Found'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Get student successfully'));
        }
    }

    @Roles(Role.Admin)
    @Post()
    async createStudents(@Body() studentDto: StudentsDto) {
        const responseData = await this.studentsService.createStudents(studentDto);
        return new ApiResponseDto(responseData, 'Create student successfully');
    }

    @Roles(Role.Admin)
    @Patch('/:ID')
    async updateStudents(@Body() studentDto: UpdateStudentRequestDto, @Param('ID') id: string, @Res() res: Response) {
        const responseData = await this.studentsService.updateStudents(studentDto, id);
        if (responseData === null) {
            return res.status(404).json(new ApiResponseDto(null, 'Student Not Found'));
        } else if (responseData === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Update successfully'));
        }
    }

    @Roles(Role.Admin)
    @Delete('/:ID')
    async deleteStudents(@Param('ID') id: string, @Res() res: Response) {
        const responseData = await this.studentsService.deleteStudents(id);
        if (responseData === null) {
            return res.status(404).json(new ApiResponseDto(null, 'Student Not Found'));
        } else if (responseData === 0) {
            return res.status(400).json(new ApiResponseDto(null, 'Delete fail'));
        } else {
            return res.status(200).json(new ApiResponseDto(null, 'Delete successfully'));
        }
    }
}
