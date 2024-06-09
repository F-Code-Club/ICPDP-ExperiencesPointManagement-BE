import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departments } from './departments.entity';
import { UsersHttpModule } from '../users/users-http.module';

@Module({
  imports: [TypeOrmModule.forFeature([Departments]), UsersHttpModule],
  exports: [TypeOrmModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService]
})
export class DepartmentsModule {}
