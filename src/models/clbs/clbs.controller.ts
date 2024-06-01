import { Body, Controller, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClbsService } from './clbs.service';
import { ClbsDto } from 'src/dto/clbs.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { Response } from 'express';
import { Role } from 'src/enum/roles/role.enum';
import { Roles } from 'src/enum/roles/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Clbs')
@Controller('clbs')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ClbsController {
    constructor (
        private readonly clbsService: ClbsService
    ) {};

    @Roles(Role.Admin)
    @Post('/create-clbs')
    async createClub(@Body() clbsDto: ClbsDto, @Res() res: Response) {
        if (await this.clbsService.findByName(clbsDto.name)) {
            return res.status(403).json(new ApiResponseDto(null, 'This name was taken'));
        }
        const responseClbs = await this.clbsService.createClbs(clbsDto);
        if (responseClbs === null) {
            return res.status(403).json(new ApiResponseDto(responseClbs, 'Create clb fail'));
        } else {
            return res.status(201).json(new ApiResponseDto(responseClbs, 'Create clb successfully'));
        }
    }

    @Roles(Role.Admin, Role.Clb)
    @Put('/:id')
    async updateClb(@Body() clbsDto: ClbsDto, @Param('id') id: string, @Res() res: Response) {
        const responseClbs = await this.clbsService.updateClbs(clbsDto, id);
        if (!responseClbs) {
            return res.status(404).json(new ApiResponseDto(responseClbs, 'Clb Not Found'));
        } else {
            return res.status(201).json(new ApiResponseDto(responseClbs, 'Update clb successfully'));
        }
    }
}
