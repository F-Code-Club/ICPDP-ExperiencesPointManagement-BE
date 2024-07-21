import { Module } from '@nestjs/common';
import { ClubMemberController } from './club-member.controller';
import { ClubMemberService } from './club-member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clbs } from '../clbs/clbs.entity';
import { Students } from '../students/students.entity';
import { StudentsHttpModule } from '../students/students-http.module';

@Module({
  imports: [TypeOrmModule.forFeature([Clbs, Students]), StudentsHttpModule],
  exports: [TypeOrmModule],
  controllers: [ClubMemberController],
  providers: [ClubMemberService]
})
export class ClubMemberModule {}
