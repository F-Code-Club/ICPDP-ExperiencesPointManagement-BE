import { Module } from "@nestjs/common";
import { FinalPointController } from "./final-point.controller";
import { FinalPointService } from "./final-point.service";

@Module({
    imports: [FinalPointHttpModule],
    controllers: [FinalPointController],
    providers: [FinalPointService],
    exports: [FinalPointService]
})

export class FinalPointHttpModule{};