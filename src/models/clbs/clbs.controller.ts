import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClbsService } from './clbs.service';
import { ClbsDto } from 'src/dto/clbs.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';
import { Response } from 'express';
import { Role } from 'src/enum/roles/role.enum';
import { Roles } from 'src/enum/roles/role.decorator';

@ApiTags('Clbs')
@Controller('clbs')
export class ClbsController {
    constructor (
        private readonly clbsService: ClbsService
    ) {};

    @Roles(Role.Admin)
    @Post('/create-clbs')
    @ApiBearerAuth()
    async createClub(@Body() clbsDto: ClbsDto, @Res() res: Response) {
        const responseClbs = await this.clbsService.createClbs(clbsDto);
        if (responseClbs === null) {
            return res.status(403).json(new ApiResponseDto(responseClbs, 'Create clb fail'));
        } else {
            return res.status(201).json(new ApiResponseDto(responseClbs, 'Create clb successfully'));
        }
    }
}
