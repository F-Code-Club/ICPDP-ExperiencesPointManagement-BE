import { Module } from "@nestjs/common";
import { EventPointModule } from "./event-point.module";
import { EventPointController } from "./event-point.controller";
import { EventPointService } from "./event-point.service";

@Module({
    imports: [EventPointModule],
    controllers: [EventPointController],
    providers: [EventPointService],
    exports: [EventPointService]
})

export class EventStudentHttpModule {};