import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Students } from './students.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Students])],
  exports: [TypeOrmModule],
  controllers: [StudentsController],
  providers: [StudentsService]
})
export class StudentsModule {}
