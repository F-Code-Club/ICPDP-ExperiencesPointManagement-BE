import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { SemestersService } from './semesters.service';
import { Role } from 'src/enum/roles/role.enum';
import { Roles } from 'src/enum/roles/role.decorator';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { CreateSemestersRequestDto } from './dto/semesters-create-request.dto';

@ApiTags('Semesters')
@Controller('semesters')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class SemestersController {
    constructor(
        private readonly semestersService: SemestersService
    ) {};

    @Roles(Role.Admin)
    @Post()
    async createSemesters(@Body() semesterDto: CreateSemestersRequestDto) {
        const responseData = await this.semestersService.createSemesters(semesterDto);
        return new ApiResponseDto(responseData, 'Create semester successfully');
    }
}
