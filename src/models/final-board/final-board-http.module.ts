import { Module } from "@nestjs/common";
import { FinalBoardModule } from "./final-board.module";
import { FinalBoardController } from "./final-board.controller";
import { FinalBoardService } from "./final-board.service";

@Module({
    imports: [FinalBoardModule],
    controllers: [FinalBoardController],
    providers: [FinalBoardService],
    exports: [FinalBoardService]
})

export class FinalBoardHttpModule{};