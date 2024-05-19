import { Module } from '@nestjs/common';
import { FinalBoardController } from './final-board.controller';
import { FinalBoardService } from './final-board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinalBoard } from './final-board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinalBoard])],
  exports: [TypeOrmModule],
  controllers: [FinalBoardController],
  providers: [FinalBoardService]
})
export class FinalBoardModule {}
