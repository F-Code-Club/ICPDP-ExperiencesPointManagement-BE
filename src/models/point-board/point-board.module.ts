import { Module } from '@nestjs/common';
import { PointBoardController } from './point-board.controller';
import { PointBoardService } from './point-board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointBoard } from './pointBoard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PointBoard])],
  exports: [TypeOrmModule],
  controllers: [PointBoardController],
  providers: [PointBoardService]
})
export class PointBoardModule {}
