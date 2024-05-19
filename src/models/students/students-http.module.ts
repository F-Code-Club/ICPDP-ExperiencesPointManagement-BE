import { Module } from "@nestjs/common";
import { StudentsModule } from "./students.module";
import { StudentsController } from "./students.controller";
import { StudentsService } from "./students.service";

@Module({
    imports: [StudentsModule],
    controllers: [StudentsController],
    providers: [StudentsService],
    exports: [StudentsService]
})

export class StudentsHttpModule{};