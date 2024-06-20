import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LocalFile } from "./local-file.entity";
import { Repository } from "typeorm";
import * as XLSX from 'xlsx';

@Injectable()
export class LocalFilesService {
    constructor(
        @InjectRepository(LocalFile)
        private readonly localFileRepo: Repository<LocalFile>
    ) {};
    
    /* 
    [POST]: /local-files
    */
    async createLocalFile(fileName: string, path: string) {
        const localFile = await this.localFileRepo.create({
            diskPath: path,
            fileName: fileName
        });
        const savedFile = await this.localFileRepo.save(localFile);
        return savedFile;
    }

    /* 
    [GET]: /local-files/{ID}
    */
    async getLocalFileInfoById(id: string): Promise<LocalFile | null> {
        const existLocalFile = await this.localFileRepo.findOne({
            where: {
                localFileID: id,
            }
        });
        return existLocalFile;
    }

    /* 
    [GET]: /local-files/excel-files/{ID}
    */
    async readExcelFileById(id: string): Promise<any> {
        const existFile = await this.localFileRepo.findOne({
            where: {
                localFileID: id,
            }
        });
        if (!existFile) {
            return null;
        }
        const checkExcelFile = await this.isExcelFile(existFile.fileName);
        if (!checkExcelFile) {
            throw new BadRequestException('This file is not an excel file');
        }
        const responseData = await this.readExcelFileByPath(existFile.diskPath);
        return responseData;
    }

    async isExcelFile(fileName: string): Promise<boolean> {
        const check = fileName.split('.').pop().toLowerCase();
        return check === 'xlsx' || check === 'xls'; 
    }

    async readExcelFileByPath(filePath: string): Promise<any> {
        const workBook = XLSX.readFile(filePath);
        const sheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(workSheet);
        return jsonData;
    }
}