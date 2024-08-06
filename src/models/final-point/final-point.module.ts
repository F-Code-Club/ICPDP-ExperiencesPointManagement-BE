import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinalPoint } from './final-point.entity';
import { FinalPointController } from './final-point.controller';
import { FinalPointService } from './final-point.service';


@Module({
  imports: [TypeOrmModule.forFeature([FinalPoint])],
  exports: [TypeOrmModule],
  controllers: [FinalPointController],
  providers: [FinalPointService]
})
export class FinalPointModule {}
