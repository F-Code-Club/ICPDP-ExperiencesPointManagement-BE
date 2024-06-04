import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
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
