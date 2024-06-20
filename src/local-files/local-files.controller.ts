import { Controller, Get, Param, Post, Request, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";
import { LocalFilesService } from "./local-files.service";
import { UploadFileDto } from "./dto/upload-file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { ApiResponseDto } from "src/utils/api-response.dto";
import { Public } from "src/auth/decorator/public.decorator";

@ApiTags('Local-Files')
@Controller('local-files')
export class LocalFilesController {
    constructor(
        private readonly localFilesService: LocalFilesService
    ) {};

    @Post()
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        type: UploadFileDto
    })
    @UseInterceptors(FileInterceptor("file"))
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async create(@Request() req, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        const info = await this.localFilesService.createLocalFile(file.filename, file.path);
        let responseData = {
            avatarURL: `${req.protocol}://${req.headers.host}/local-files/${info.localFileID}`
        };
        return res.status(201).json(new ApiResponseDto(responseData, 'Upload file successfully'));
    }

    @Public()
    @Get('/:ID')
    async getFile(@Param('ID') id: string, @Res() res: Response) {
        const responseData = await this.localFilesService.getLocalFileInfoById(id);
        if (!responseData) {
            return res.status(404).json(new ApiResponseDto(null, 'File not found'));
        }
        return res.sendFile(responseData.diskPath, { root: "." });
    }

    @Public()
    @Get('/excel-files/:ID')
    async readExcelFile(@Param('ID') id: string, @Res() res: Response) {
        const responseData = await this.localFilesService.readExcelFileById(id);
        if (!responseData) {
            return res.status(404).json(new ApiResponseDto(null, 'File not found'));
        }
        return res.status(200).json(new ApiResponseDto(responseData, 'Read excel file successfully'));
    }
}