import { Module } from '@nestjs/common';
import { RoleClbsController } from './role-clbs.controller';
import { RoleClbsService } from './role-clbs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleClbs } from './roleClbs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleClbs])],
  exports: [TypeOrmModule],
  controllers: [RoleClbsController],
  providers: [RoleClbsService]
})
export class RoleClbsModule {}
