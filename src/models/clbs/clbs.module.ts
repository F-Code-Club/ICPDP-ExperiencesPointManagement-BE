import { Module } from '@nestjs/common';
import { ClbsController } from './clbs.controller';
import { ClbsService } from './clbs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clbs } from './clbs.entity';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/enum/roles/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersHttpModule } from '../users/users-http.module';
import { BadRequestExceptionExceptionFilter } from 'src/utils/badrequest-exception.filter';
import { UnauthorizedExceptionFilter } from 'src/utils/unauthorized-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([Clbs]), UsersHttpModule],
  exports: [TypeOrmModule],
  controllers: [ClbsController],
  providers: [ClbsService,
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
export class ClbsModule {}
