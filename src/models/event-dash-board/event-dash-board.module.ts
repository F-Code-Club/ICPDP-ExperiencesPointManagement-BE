import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clbs } from '../clbs/clbs.entity';
import { Departments } from '../departments/departments.entity';
import { EventDashBoardController } from './event-dash-board.controller';
import { EventDashBoardService } from './event-dash-board.service';
import { Events } from '../event/event.entity';
import { Semesters } from '../semesters/semesters.entity';
import { SemestersHttpModule } from '../semesters/semesters-http.module';

@Module({
    imports: [TypeOrmModule.forFeature([Clbs, Departments, Events, Semesters]), SemestersHttpModule],
    exports: [TypeOrmModule],
    controllers: [EventDashBoardController],
    providers: [EventDashBoardService]
})
export class EventDashBoardModule {}
