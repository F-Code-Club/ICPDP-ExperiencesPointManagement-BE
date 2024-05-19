import { Module } from "@nestjs/common";
import { RoleDepartmentsModule } from "./role-departments.module";
import { RoleDepartmentsController } from "./role-departments.controller";
import { RoleDepartmentsService } from "./role-departments.service";

@Module({
    imports: [RoleDepartmentsModule],
    controllers: [RoleDepartmentsController],
    providers: [RoleDepartmentsService],
    exports: [RoleDepartmentsService],
})

export class RoleDeparmentsHttpModule {};