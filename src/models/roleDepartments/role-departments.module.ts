import { Module } from '@nestjs/common';
import { RoleDepartmentsController } from './role-departments.controller';
import { RoleDepartmentsService } from './role-departments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleDepartments } from './roleDepartments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleDepartments])],
  exports: [TypeOrmModule],
  controllers: [RoleDepartmentsController],
  providers: [RoleDepartmentsService]
})
export class RoleDepartmentsModule {}
