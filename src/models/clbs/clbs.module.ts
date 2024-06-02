import { Module } from '@nestjs/common';
import { ClbsController } from './clbs.controller';
import { ClbsService } from './clbs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clbs } from './clbs.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/enum/roles/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Clbs])],
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
    }
  ]
})
export class ClbsModule {}
