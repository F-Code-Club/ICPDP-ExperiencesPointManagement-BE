import { Module } from "@nestjs/common";
import { EventPointModule } from "./event-point.module";
import { EventPointController } from "./event-point.controller";
import { EventPointService } from "./event-point.service";
import { EventHttpModule } from "../event/event-http.module";
import { DepartmentsHttpModule } from "../departments/departments-http.module";
import { ClbsHttpModule } from "../clbs/clbs-http.module";
import { StudentsHttpModule } from "../students/students-http.module";
import { RoleClbsHttpModule } from "../roleClbs/role-clbs-http.module";
import { RoleDeparmentsHttpModule } from "../roleDepartments/role-departments-http.module";
import { ClubMemberHttpModule } from "../clubMember/club-member-http.module";
import { DepartmentMemberHttpModule } from "../departmentMember/department-member-http.module";
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
    imports: [MulterModule.register({ storage, limits: { fileSize: 8 * 1024 * 1024 } }), EventPointModule, EventHttpModule, ClbsHttpModule, DepartmentsHttpModule, StudentsHttpModule, RoleClbsHttpModule, RoleDeparmentsHttpModule, ClubMemberHttpModule, DepartmentMemberHttpModule, LocalFilesModule],
    controllers: [EventPointController],
    providers: [EventPointService],
    exports: [EventPointService]
})

export class EventPointHttpModule {};