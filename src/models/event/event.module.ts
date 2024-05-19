import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Events } from './event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Events])],
  exports: [TypeOrmModule],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
