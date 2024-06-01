import { ExceptionFilter, Catch, ArgumentsHost, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    response
      .status(HttpStatus.FORBIDDEN)
      .json({
        data: null,
        message: exception.message,
      });
  }
}
