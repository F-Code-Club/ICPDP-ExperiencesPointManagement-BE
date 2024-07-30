import { Module } from "@nestjs/common";
import { ClubMemberController } from "./club-member.controller";
import { ClubMemberService } from "./club-member.service";
import { ClubMemberModule } from "./club-member.module";
import { StudentsHttpModule } from "../students/students-http.module";

@Module({
    imports: [ClubMemberModule, StudentsHttpModule],
    controllers: [ClubMemberController],
    providers: [ClubMemberService],
    exports: [ClubMemberService]
})

export class ClubMemberHttpModule {};