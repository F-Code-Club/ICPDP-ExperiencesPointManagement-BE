import { Module } from "@nestjs/common";
import { FinalPointController } from "./final-point.controller";
import { FinalPointService } from "./final-point.service";
import { FinalPointModule } from "./final-point.module";

@Module({
    imports: [FinalPointModule],
    controllers: [FinalPointController],
    providers: [FinalPointService],
    exports: [FinalPointService]
})

export class FinalPointHttpModule{};