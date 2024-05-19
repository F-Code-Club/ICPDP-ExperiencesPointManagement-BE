import { Module } from "@nestjs/common";
import { PointBoardModule } from "./point-board.module";
import { PointBoardController } from "./point-board.controller";
import { PointBoardService } from "./point-board.service";

@Module({
    imports: [PointBoardModule],
    controllers: [PointBoardController],
    providers: [PointBoardService],
    exports: [PointBoardService]
})

export class PointBoardHttpModule {};
