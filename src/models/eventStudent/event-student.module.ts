import { Module } from '@nestjs/common';
import { EventStudentController } from './event-student.controller';
import { EventStudentService } from './event-student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStudent } from './event-student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventStudent])],
  exports: [TypeOrmModule],
  controllers: [EventStudentController],
  providers: [EventStudentService]
})
export class EventStudentModule {}
