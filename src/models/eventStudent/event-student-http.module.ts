import { Module } from "@nestjs/common";
import { EventStudentModule } from "./event-student.module";
import { EventStudentController } from "./event-student.controller";
import { EventStudentService } from "./event-student.service";

@Module({
    imports: [EventStudentModule],
    controllers: [EventStudentController],
    providers: [EventStudentService],
    exports: [EventStudentService]
})

export class EventStudentHttpModule {};