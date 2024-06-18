import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departments } from './departments.entity';
import { UsersHttpModule } from '../users/users-http.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/enum/roles/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { BadRequestExceptionExceptionFilter } from 'src/utils/badrequest-exception.filter';
import { UnauthorizedExceptionFilter } from 'src/utils/unauthorized-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([Departments]), UsersHttpModule],
  exports: [TypeOrmModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService,
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
export class DepartmentsModule {}
