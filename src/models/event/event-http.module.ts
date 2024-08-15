import { Module } from "@nestjs/common";
import { EventModule } from "./event.module";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { ClbsHttpModule } from "../clbs/clbs-http.module";
import { DepartmentsHttpModule } from "../departments/departments-http.module";
import { SemestersHttpModule } from "../semesters/semesters-http.module";

@Module({
    imports: [EventModule, ClbsHttpModule, DepartmentsHttpModule, SemestersHttpModule],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService]
})

export class EventHttpModule {};