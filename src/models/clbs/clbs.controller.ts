import { Body, Controller, Delete, Get, Param, Post, Put, Request, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClbsService } from './clbs.service';
import { ClbsDto } from 'src/dto/clbs.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { Response } from 'express';
import { Role } from 'src/enum/roles/role.enum';
import { Roles } from 'src/enum/roles/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ForbiddenExceptionFilter } from 'src/utils/forbidden-exception.filter';

@ApiTags('Clubs')
@Controller('clubs')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@UseFilters(ForbiddenExceptionFilter)
export class ClbsController {
    constructor (
        private readonly clbsService: ClbsService
    ) {};

    @Roles(Role.Admin, Role.Clb)
    @Get('/:id')
    async getClubById(@Request() req, id: string, @Res() res: Response) {
        const responseClb = await this.clbsService.getClubById(id, req.user.role, req.user.sub);        
        if (!responseClb) {
            return res.status(404).json(new ApiResponseDto(responseClb, 'Clb Not Found'));
        } else {
            return res.status(200).json(new ApiResponseDto(responseClb, 'Get club successfully'));
        }
    }

    @Roles(Role.Admin)
    @Post()
    async createClub(@Body() clbsDto: ClbsDto, @Res() res: Response) {
        if (await this.clbsService.findByName(clbsDto.name)) {
            return res.status(403).json(new ApiResponseDto(null, 'This name was taken'));
        }
        const responseClbs = await this.clbsService.createClbs(clbsDto);
        if (responseClbs === null) {
            return res.status(400).json(new ApiResponseDto(responseClbs, 'Create clb fail'));
        } else {
            return res.status(201).json(new ApiResponseDto(responseClbs, 'Create clb successfully'));
        }
    }

    @Roles(Role.Admin, Role.Clb)
    @Put('/:id')
    async updateClb(@Request() req, @Body() clbsDto: ClbsDto, @Param('id') id: string, @Res() res: Response) {
        const responseClbs = await this.clbsService.updateClbs(clbsDto, id, req.user.role, req.user.sub);
        if (!responseClbs) {
            return res.status(404).json(new ApiResponseDto(responseClbs, 'Clb Not Found'));
        } else {
            return res.status(201).json(new ApiResponseDto(responseClbs, 'Update clb successfully'));
        }
    }

    @Roles(Role.Admin)
    @Delete('/:id')
    async deleteClb(@Param('id') id: string, @Res() res: Response) {
        const resultDelete = await this.clbsService.deleteClbs(id);
        if (resultDelete === null) {
            return res.status(404).json(new ApiResponseDto(null, 'Club not found'));
        } else if (null === 0) {
            return res.status(400).json(new ApiResponseDto(null, 'Delete fail'));
        } else {
            return res.status(201).json(new ApiResponseDto(null, 'Delete successfully'));
        }
    }
}
