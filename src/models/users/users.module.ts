import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Clbs } from '../clbs/clbs.entity';
import { Departments } from '../departments/departments.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Users, Clbs, Departments])],
    exports: [TypeOrmModule],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
