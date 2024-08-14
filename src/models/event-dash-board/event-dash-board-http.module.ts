import { Module } from "@nestjs/common";
import { EventDashBoardController } from "./event-dash-board.controller";
import { EventDashBoardModule } from "./event-dash-board.module";
import { EventDashBoardService } from "./event-dash-board.service";
import { SemestersHttpModule } from "../semesters/semesters-http.module";

@Module({
    imports: [EventDashBoardModule, SemestersHttpModule],
    controllers: [EventDashBoardController],
    providers: [EventDashBoardService],
    exports: [EventDashBoardService],
})

export class EventDashBoardHttpModule {};