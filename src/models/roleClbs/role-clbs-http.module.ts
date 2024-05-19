import { Module } from "@nestjs/common";
import { RoleClbsModule } from "./role-clbs.module";
import { RoleClbsController } from "./role-clbs.controller";
import { RoleClbsService } from "./role-clbs.service";

@Module({
    imports: [RoleClbsModule],
    controllers: [RoleClbsController],
    providers: [RoleClbsService],
    exports: [RoleClbsService]
})
export class RoleClbsHttpModule{};