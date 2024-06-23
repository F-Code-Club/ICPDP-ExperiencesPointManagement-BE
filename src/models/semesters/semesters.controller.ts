import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { SemestersService } from './semesters.service';
import { Role } from 'src/enum/roles/role.enum';
import { Roles } from 'src/enum/roles/role.decorator';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { CreateSemestersRequestDto } from './dto/semesters-create-request.dto';
import { Response } from 'express';
import { SemestersFilterDto } from './dto/semesters-filter.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';
import { SemestersResponseDto } from './dto/semester-response.dto';
import { SemestersUpdateRequestDto } from './dto/semesters-update-request.dto';

@ApiTags('Semesters')
@Controller('semesters')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class SemestersController {
    constructor(
        private readonly semestersService: SemestersService
    ) {};

    @Roles(Role.Admin)
    @Get()
    async getAllSemesters(@Query() filter: SemestersFilterDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [semesters, count] = await this.semestersService.getAllSemesters(filter);
        let message = 'Get semesters successfully';
        if (!semesters || count == 0) {
            message = 'Get semesters fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(semesters, SemestersResponseDto), filter, count, message);
    }

    @Get('/now')
    async getCurrentSemester(@Res() res: Response) {
        const responseData = await this.semestersService.getCurrentSemester();
        if (!responseData) {
            return res.status(404).json(new ApiResponseDto(responseData, 'No current semester found'));
        }
        return res.status(200).json(new ApiResponseDto(responseData, 'Get current semester successfully'));
    }

    @Roles(Role.Admin)
    @Post()
    async createSemesters(@Body() semesterDto: CreateSemestersRequestDto) {
        const responseData = await this.semestersService.createSemesters(semesterDto);
        return new ApiResponseDto(responseData, 'Create semester successfully');
    }

    @Roles(Role.Admin)
    @Patch('/:ID')
    async updateSemester(@Body() updateDto: SemestersUpdateRequestDto, @Param('ID') id: string, @Res() res: Response) {
        const responseData = await this.semestersService.updateSemester(updateDto, id);
        if (responseData === null) {
            return res.status(404).json(new ApiResponseDto(null, 'Semester Not Found'));            
        } else if (responseData === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Update successfully'));
        }
    }

}
