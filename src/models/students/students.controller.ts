import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { StudentsService } from './students.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { StudentsDto } from 'src/dto/students.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';

@ApiTags('Students')
@Controller('students')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class StudentsController {
    constructor (
        private readonly studentsService: StudentsService,
    ) {};

    @Roles(Role.Admin)
    @Post()
    async createStudents(@Body() studentDto: StudentsDto) {
        const responseData = await this.studentsService.createStudents(studentDto);
        return new ApiResponseDto(responseData, 'Create student successfully');
    }
}
