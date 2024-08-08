import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Students } from './students.entity';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/enum/roles/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UnauthorizedExceptionFilter } from 'src/utils/unauthorized-exception.filter';
import { BadRequestExceptionExceptionFilter } from 'src/utils/badrequest-exception.filter';
import { LocalFilesModule } from 'src/local-files/local-files.module';
import { FinalPointHttpModule } from '../final-point/final-point-http.module';
import { EventPoint } from '../eventPoint/event-point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Students, EventPoint]), LocalFilesModule, FinalPointHttpModule],
  exports: [TypeOrmModule],
  controllers: [StudentsController],
  providers: [StudentsService,
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
export class StudentsModule {}
