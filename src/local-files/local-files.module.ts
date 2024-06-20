import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocalFile } from "./local-file.entity";
import { LocalFilesController } from "./local-files.controller";
import { LocalFilesService } from "./local-files.service";
import * as fs from "fs";
import * as multer from "multer";

const uploadsFolder = 'uploads';

const storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        if(!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder);
        }
        cb(null, uploadsFolder);
    },
    filename: (req, file, cb) => {
        const fileInfo = file.originalname.split(".");
        let fileName = file.originalname;
        let filePath = `${uploadsFolder}/${fileName}`;
        let i = 1;
        while(fs.existsSync(filePath)) {
            fileName = fileInfo[0] + `(${i})` + (fileInfo.length > 1 ? "." + fileInfo[1] : "");
            filePath = `${uploadsFolder}/${fileName}`;
            i++;
        }
        cb(null, fileName);
    }
});


@Module({
    imports: [MulterModule.register({ storage, limits: { fileSize: 25 * 1024 * 1024 } }), TypeOrmModule.forFeature([LocalFile])],
    controllers: [LocalFilesController],
    providers: [LocalFilesService],
    exports: [LocalFilesService]
})
export class LocalFilesModule {}