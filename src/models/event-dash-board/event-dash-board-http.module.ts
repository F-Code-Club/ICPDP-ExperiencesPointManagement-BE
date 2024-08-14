import { Module } from "@nestjs/common";
import { EventDashBoardController } from "./event-dash-board.controller";
import { EventDashBoardModule } from "./event-dash-board.module";
import { EventDashBoardService } from "./event-dash-board.service";

@Module({
    imports: [EventDashBoardModule],
    controllers: [EventDashBoardController],
    providers: [EventDashBoardService],
    exports: [EventDashBoardService],
})

export class EventDashBoardHttpModule {};