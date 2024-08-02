import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LocalFile } from "./local-file.entity";
import { Repository } from "typeorm";
import * as XLSX from 'xlsx';
import { StudentsDto } from "src/dto/students.dto";
import { AddMemberDto } from "src/dto/addMember.dto";

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
        const localFile = this.localFileRepo.create({
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
    [POST]: /students/import

    [POST]: /club-member/import
    */
    async createExcelFile(fileName: string, path: string): Promise<LocalFile> {
        const localFile = this.localFileRepo.create({
            diskPath: path,
            fileName: fileName
        });

        const isExcel = await this.isExcelFile(fileName);
        
        if (!isExcel) {
            throw new BadRequestException('This file is not an excel file');
        }

        const savedFile = await this.localFileRepo.save(localFile);
        return savedFile;
    }

    /* 
    [POST]: /students/import
    */
    async readExcelFileById(id: string) {
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

    /*
    [POST]: /club-member/import

    [POST]: /department-member/import
    */
    async readExcelFileForImportMember(id: string) {
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
        const responseData = await this.readExcelFile(existFile.diskPath);
        return responseData;
    }

    async isExcelFile(fileName: string): Promise<boolean> {
        const check = fileName.split('.').pop().toLowerCase();
        return check === 'xlsx' || check === 'xls'; 
    }

    /*
    this readExcelFileByPath return StudentsDto[]
    */
    async readExcelFileByPath(filePath: string): Promise<StudentsDto[]> {
        const workBook = XLSX.readFile(filePath);
        const sheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[sheetName];
        const jsonData: StudentsDto[] = XLSX.utils.sheet_to_json(workSheet);
        return jsonData;
    }

    /*
    this readExcelFile return AddMemberDto[] for [POST]: club-member/import and [POST]: department-member/import
    */
    async readExcelFile(filePath: string): Promise<AddMemberDto[]> {
        const workBook = XLSX.readFile(filePath);
        const sheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[sheetName];
        const jsonData: AddMemberDto[] = XLSX.utils.sheet_to_json(workSheet);
        return jsonData;
    }
}