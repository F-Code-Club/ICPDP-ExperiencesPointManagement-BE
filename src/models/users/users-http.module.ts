import { Module } from "@nestjs/common";
import { UsersModule } from "./users.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { MyExceptionFilter } from "src/utils/my-exception.filter";
import { ValidationPipe } from "src/utils/validation.pipe";

@Module({
    imports: [UsersModule],
    controllers: [UsersController],
    providers: [UsersService,
        {
            provide: APP_FILTER,
            useClass: MyExceptionFilter,
        },
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        }
    ],
    exports: [UsersService]
})

export class UsersHttpModule{};