import { ExceptionFilter, ArgumentsHost, HttpStatus, HttpException, Catch } from "@nestjs/common";
import { Response } from "express";
import { ApiError } from "src/errors/api-error";

/**
 * Global exception filter to handle all uncaught exceptions.
 * It catches various exception types and transforms them into a consistent API error format.
 */
@Catch()
export class MyExceptionFilter implements ExceptionFilter {
    /**
     * Handles the thrown exception.
     * 
     * @param exception The thrown exception.
     * @param host The arguments host providing access to the request/response objects.
     */
    catch(exception: any, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse<Response>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let data: ApiError<any> = { message: "Internal Server Error", detail: null };

        // Handle specific exception types and extract relevant information.
        if (exception instanceof ApiError) {
            status = HttpStatus.BAD_REQUEST;
            data = exception;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            data = { message: exception.message, detail: exception.getResponse() }
        } else {
            // Log unexpected errors for debugging.
            console.error(exception);
        }
        // Send the formatted error response.
        res.status(status).send(data.detail);
    }
} 