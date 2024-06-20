import { Module } from "@nestjs/common";
import { StudentsModule } from "./students.module";
import { StudentsController } from "./students.controller";
import { StudentsService } from "./students.service";
import { LocalFilesModule } from "src/local-files/local-files.module";
import * as fs from "fs";
import * as multer from "multer";
import { MulterModule } from "@nestjs/platform-express";

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
    imports: [MulterModule.register({ storage }), StudentsModule, LocalFilesModule],
    controllers: [StudentsController],
    providers: [StudentsService],
    exports: [StudentsService]
})

export class StudentsHttpModule{};