import { Module } from '@nestjs/common';
import { ClbsController } from './clbs.controller';
import { ClbsService } from './clbs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clbs } from './clbs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clbs])],
  exports: [TypeOrmModule],
  controllers: [ClbsController],
  providers: [ClbsService]
})
export class ClbsModule {}
