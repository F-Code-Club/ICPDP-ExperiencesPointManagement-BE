import { Module } from '@nestjs/common';
import { EventPointController } from './event-point.controller';
import { EventPointService } from './event-point.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventPoint } from './event-point.entity';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/enum/roles/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { BadRequestExceptionExceptionFilter } from 'src/utils/badrequest-exception.filter';
import { UnauthorizedExceptionFilter } from 'src/utils/unauthorized-exception.filter';
import { EventHttpModule } from '../event/event-http.module';
import { DepartmentsHttpModule } from '../departments/departments-http.module';
import { ClbsHttpModule } from '../clbs/clbs-http.module';
import { StudentsHttpModule } from '../students/students-http.module';
import { RoleClbsHttpModule } from '../roleClbs/role-clbs-http.module';
import { RoleDeparmentsHttpModule } from '../roleDepartments/role-departments-http.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventPoint]), EventHttpModule, ClbsHttpModule, DepartmentsHttpModule, StudentsHttpModule, RoleClbsHttpModule, RoleDeparmentsHttpModule],
  exports: [TypeOrmModule],
  controllers: [EventPointController],
  providers: [EventPointService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    }
  ]
})
export class EventPointModule {}
