import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersHttpModule } from 'src/models/users/users-http.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UnauthorizedExceptionFilter } from 'src/utils/unauthorized-exception.filter';

@Module({
  imports: [
    UsersHttpModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    }
  ]
})
export class AuthModule {}
