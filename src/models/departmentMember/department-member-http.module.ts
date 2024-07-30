import { Module } from "@nestjs/common";
import { DepartmentMemberModule } from "./department-member.module";
import { StudentsHttpModule } from "../students/students-http.module";
import { DepartmentMemberController } from "./department-member.controller";
import { DepartmentMemberService } from "./department-member.service";

@Module({
    imports: [DepartmentMemberModule, StudentsHttpModule],
    controllers: [DepartmentMemberController],
    providers: [DepartmentMemberService],
    exports: [DepartmentMemberService]
})

export class DepartmentMemberHttpModule {};