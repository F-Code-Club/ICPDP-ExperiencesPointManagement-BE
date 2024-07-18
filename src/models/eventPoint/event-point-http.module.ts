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

@Module({
    imports: [EventPointModule, EventHttpModule, ClbsHttpModule, DepartmentsHttpModule, StudentsHttpModule, RoleClbsHttpModule, RoleDeparmentsHttpModule],
    controllers: [EventPointController],
    providers: [EventPointService],
    exports: [EventPointService]
})

export class EventPointHttpModule {};