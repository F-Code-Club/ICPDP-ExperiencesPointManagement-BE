import { Module } from "@nestjs/common";
import { EventModule } from "./event.module";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";

@Module({
    imports: [EventModule],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService]
})

export class EventHttpModule {};