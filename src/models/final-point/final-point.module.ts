import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinalPoint } from './final-point.entity';
import { FinalPointController } from './final-point.controller';
import { FinalPointService } from './final-point.service';
import { EventPoint } from '../eventPoint/event-point.entity';
import { Students } from '../students/students.entity';
import { Semesters } from '../semesters/semesters.entity';
import { Events } from '../event/event.entity';


@Module({
  imports: [TypeOrmModule.forFeature([FinalPoint, EventPoint, Students, Semesters, Events])],
  exports: [TypeOrmModule],
  controllers: [FinalPointController],
  providers: [FinalPointService]
})
export class FinalPointModule {}
