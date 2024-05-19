import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersHttpModule } from './models/users/users-http.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './models/users/users.entity';
import { DataSource } from 'typeorm';
import { RoleClbs } from './models/roleClbs/roleClbs.entity';
import { RoleClbsHttpModule } from './models/roleClbs/role-clbs-http.module';
import { RoleDeparmentsHttpModule } from './models/roleDepartments/role-departments-http.module';
import { RoleDepartments } from './models/roleDepartments/roleDepartments.entity';
import { Semesters } from './models/semesters/semesters.entity';
import { SemestersHttpModule } from './models/semesters/semesters-http.module';
import { StudentsHttpModule } from './models/students/students-http.module';
import { Students } from './models/students/students.entity';
import { PointBoard } from './models/point-board/pointBoard.entity';
import { PointBoardHttpModule } from './models/point-board/point-board-http.module';
import { FinalBoard } from './models/final-board/final-board.entity';
import { FinalBoardHttpModule } from './models/final-board/final-board-http.module';
import { Clbs } from './models/clbs/clbs.entity';
import { ClbsHttpModule } from './models/clbs/clbs-http.module';
import { Departments } from './models/departments/departments.entity';
import { DepartmentsHttpModule } from './models/departments/departments-http.module';
import { Events } from './models/event/event.entity';
import { EventHttpModule } from './models/event/event-http.module';
import { EventStudent } from './models/eventStudent/event-student.entity';
import { EventStudentHttpModule } from './models/eventStudent/event-student-http.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '13022014',
      database: 'experimentpointmanagement',
      entities: [Users, 
                 RoleClbs, 
                 RoleDepartments, 
                 Semesters,
                 Students,
                 PointBoard,
                 FinalBoard,
                 Clbs,
                 Departments,
                 Events,
                 EventStudent],
      synchronize: true,
    }),
    UsersHttpModule,
    RoleClbsHttpModule,
    RoleDeparmentsHttpModule,
    SemestersHttpModule,
    StudentsHttpModule,
    PointBoardHttpModule,
    FinalBoardHttpModule,
    ClbsHttpModule,
    DepartmentsHttpModule,
    EventHttpModule,
    EventStudentHttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {};
}
