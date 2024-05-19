import { Module } from "@nestjs/common";
import { SemestersModule } from "./semesters.module";
import { SemestersController } from "./semesters.controller";
import { SemestersService } from "./semesters.service";

@Module({
    imports: [SemestersModule],
    controllers: [SemestersController],
    providers: [SemestersService],
    exports: [SemestersService],
})

export class SemestersHttpModule{};