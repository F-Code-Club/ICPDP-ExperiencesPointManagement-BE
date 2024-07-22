import { Module } from '@nestjs/common';
import { DepartmentMemberController } from './department-member.controller';
import { DepartmentMemberService } from './department-member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departments } from '../departments/departments.entity';
import { Students } from '../students/students.entity';
import { StudentsHttpModule } from '../students/students-http.module';

@Module({
  imports: [TypeOrmModule.forFeature([Departments, Students]), StudentsHttpModule],
  exports: [TypeOrmModule],
  controllers: [DepartmentMemberController],
  providers: [DepartmentMemberService]
})
export class DepartmentMemberModule {}
