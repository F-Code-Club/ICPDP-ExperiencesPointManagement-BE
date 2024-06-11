import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LocalFile } from "./local-file.entity";
import { Repository } from "typeorm";

@Injectable()
export class LocalFilesService {
    constructor(
        @InjectRepository(LocalFile)
        private readonly localFileRepo: Repository<LocalFile>
    ) {};

    async createLocalFile(fileName: string, path: string) {
        const localFile = await this.localFileRepo.create({
            diskPath: path,
            fileName: fileName
        });
        const savedFile = await this.localFileRepo.save(localFile);
        return savedFile;
    }

    async getLocalFileInfoById(id: string): Promise<LocalFile | null> {
        const existLocalFile = await this.localFileRepo.findOne({
            where: {
                localFileID: id,
            }
        });
        return existLocalFile;
    }
}