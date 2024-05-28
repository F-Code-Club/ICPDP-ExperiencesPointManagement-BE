import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    response
      .status(HttpStatus.UNAUTHORIZED)
      .json({
        data: null,
        message: 'Unauthorized'
      });
  }
}
