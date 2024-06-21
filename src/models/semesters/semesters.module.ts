import { Module } from '@nestjs/common';
import { SemestersController } from './semesters.controller';
import { SemestersService } from './semesters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semesters } from './semesters.entity';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/enum/roles/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UnauthorizedExceptionFilter } from 'src/utils/unauthorized-exception.filter';
import { BadRequestExceptionExceptionFilter } from 'src/utils/badrequest-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([Semesters])],
  exports: [TypeOrmModule],
  controllers: [SemestersController],
  providers: [SemestersService,
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
      useClass: BadRequestExceptionExceptionFilter
      ,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    }
  ]
})
export class SemestersModule {}
