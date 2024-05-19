import { Module } from "@nestjs/common";
import { DepartmentsModule } from "./departments.module";
import { DepartmentsController } from "./departments.controller";
import { DepartmentsService } from "./departments.service";

@Module({
    imports: [DepartmentsModule],
    controllers: [DepartmentsController],
    providers: [DepartmentsService],
    exports: [DepartmentsService]
})

export class DepartmentsHttpModule {};