import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { FinalPointService } from './final-point.service';
import { Roles } from 'src/enum/roles/role.decorator';
import { Role } from 'src/enum/roles/role.enum';
import { FinalPointFilterDto } from './dto/final-point-filter.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { DtoMapper } from 'src/utils/dto-mapper.dto';
import { FinalPointResponseDto } from './dto/final-point-response.dto';
import { FinalPointUpdateDto } from './dto/final-point-patch-request.dto';
import { Response } from 'express';
import { ApiResponseDto } from 'src/utils/api-response.dto';

@ApiTags('FinalPoint')
@Controller('final-point')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FinalPointController {
    constructor (
        private readonly finalPointService: FinalPointService,
    ) {};

    @Roles(Role.Admin)
    @Get('/:year&:semester')
    async getFinalPoints (@Param('year') year: number, @Param('semester') semester: string, @Query() filter: FinalPointFilterDto) {
        if (!filter) {
            throw new BadRequestException('Lacked of request param');
        }
        const [finalPoints, count] = await this.finalPointService.getFinalPoints(filter, year, semester);
        let message = 'Get final points successfully';
        if (!finalPoints || count == 0) {  
            message = 'Get final points fail';
        }
        return PaginationDto.from(DtoMapper.mapMany(finalPoints, FinalPointResponseDto), filter, count, message);
    }

    @Roles(Role.Admin)
    @Post('/:year&:semester')
    async calculateFinalPoint (@Param('year') year: number, @Param('semester') semester: string) {
        const responseData = await this.finalPointService.findBySemester(year, semester);
        return new ApiResponseDto(responseData, 'Calculate final point successfully');
    }

    @Roles(Role.Admin)
    @Patch('/:year&:semester&:studentID')
    async updateFinalPoint (@Param('year') year: number, @Param('semester') semester: string, @Param('studentID') studentID: string, @Body() updateDto: FinalPointUpdateDto, @Res() res: Response) {
        const responseData = await this.finalPointService.updateFinalPoints(updateDto, year, semester, studentID);
        if (responseData === 'Nothing changed') {
            return res.status(200).json(new ApiResponseDto(null, 'Nothing changed'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseData, 'Update final point successfully'));
        }
    }
}
