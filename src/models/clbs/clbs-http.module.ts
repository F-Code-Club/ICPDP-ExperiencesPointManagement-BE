import { Module } from "@nestjs/common";
import { ClbsModule } from "./clbs.module";
import { ClbsController } from "./clbs.controller";
import { ClbsService } from "./clbs.service";
import { UsersHttpModule } from "../users/users-http.module";

@Module({
    imports: [ClbsModule, UsersHttpModule],
    controllers: [ClbsController],
    providers: [ClbsService],
    exports: [ClbsService]
})

export class ClbsHttpModule {};