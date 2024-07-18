import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Events } from './event.entity';
import { ClbsHttpModule } from '../clbs/clbs-http.module';
import { DepartmentsHttpModule } from '../departments/departments-http.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/enum/roles/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { BadRequestExceptionExceptionFilter } from 'src/utils/badrequest-exception.filter';
import { UnauthorizedExceptionFilter } from 'src/utils/unauthorized-exception.filter';
import { EventPoint } from '../eventPoint/event-point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Events]), TypeOrmModule.forFeature([EventPoint]), ClbsHttpModule, DepartmentsHttpModule],
  exports: [TypeOrmModule],
  controllers: [EventController],
  providers: [EventService,
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
export class EventModule {}
