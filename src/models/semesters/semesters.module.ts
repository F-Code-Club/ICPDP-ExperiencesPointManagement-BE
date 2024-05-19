import { Module } from '@nestjs/common';
import { SemestersController } from './semesters.controller';
import { SemestersService } from './semesters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semesters } from './semesters.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Semesters])],
  exports: [TypeOrmModule],
  controllers: [SemestersController],
  providers: [SemestersService]
})
export class SemestersModule {}
