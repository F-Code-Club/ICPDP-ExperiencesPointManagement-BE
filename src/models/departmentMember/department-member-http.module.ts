import { Module } from "@nestjs/common";
import { DepartmentMemberModule } from "./department-member.module";
import { StudentsHttpModule } from "../students/students-http.module";
import { DepartmentMemberController } from "./department-member.controller";
import { DepartmentMemberService } from "./department-member.service";
import * as fs from "fs";
import * as multer from "multer";
import { MulterModule } from "@nestjs/platform-express";
import { LocalFilesModule } from "src/local-files/local-files.module";

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
    imports: [MulterModule.register({ storage, limits: { fileSize: 8 * 1024 * 1024 } }), DepartmentMemberModule, StudentsHttpModule, LocalFilesModule],
    controllers: [DepartmentMemberController],
    providers: [DepartmentMemberService],
    exports: [DepartmentMemberService]
})

export class DepartmentMemberHttpModule {};