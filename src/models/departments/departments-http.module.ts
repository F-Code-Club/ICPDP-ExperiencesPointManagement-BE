import { Module } from "@nestjs/common";
import { DepartmentsModule } from "./departments.module";
import { DepartmentsController } from "./departments.controller";
import { DepartmentsService } from "./departments.service";
import { UsersHttpModule } from "../users/users-http.module";

@Module({
    imports: [DepartmentsModule, UsersHttpModule],
    controllers: [DepartmentsController],
    providers: [DepartmentsService],
    exports: [DepartmentsService]
})

export class DepartmentsHttpModule {};