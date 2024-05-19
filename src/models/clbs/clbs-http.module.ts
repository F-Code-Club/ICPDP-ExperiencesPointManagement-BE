import { Module } from "@nestjs/common";
import { ClbsModule } from "./clbs.module";
import { ClbsController } from "./clbs.controller";
import { ClbsService } from "./clbs.service";

@Module({
    imports: [ClbsModule],
    controllers: [ClbsController],
    providers: [ClbsService],
    exports: [ClbsService]
})

export class ClbsHttpModule {};