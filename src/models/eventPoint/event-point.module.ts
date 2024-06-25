import { Module } from '@nestjs/common';
import { EventPointController } from './event-point.controller';
import { EventPointService } from './event-point.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventPoint } from './event-point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventPoint])],
  exports: [TypeOrmModule],
  controllers: [EventPointController],
  providers: [EventPointService]
})
export class EventPointModule {}
