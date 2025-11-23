import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { BaseException } from '../exceptions/custom-exceptions';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string;
    let error: string;
    let details: any;
    let validationErrors: any[] | undefined;

    if (exception instanceof BaseException) {
      // Handle custom exceptions
      statusCode = exception.getStatus();
      message = exception.message;
      error = HttpStatus[statusCode] || 'Error';
      details = exception.details;

      // Extract validation errors if present
      if (details?.errors) {
        validationErrors = details.errors;
      }
    } else if (exception instanceof HttpException) {
      // Handle NestJS built-in exceptions
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = HttpStatus[statusCode] || 'Error';
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || HttpStatus[statusCode] || 'Error';

        // Handle validation errors from class-validator
        if (Array.isArray(responseObj.message)) {
          validationErrors = responseObj.message.map((msg: string) => {
            // Parse validation message format: "field should be..."
            const match = msg.match(/^(\w+)\s+(.+)$/);
            if (match) {
              return {
                field: match[1],
                message: match[2],
              };
            }
            return {
              field: 'unknown',
              message: msg,
            };
          });
          message = 'Validation failed';
        }

        details = responseObj.details || (responseObj.message && !Array.isArray(responseObj.message) ? { message: responseObj.message } : undefined);
      } else {
        message = exception.message;
        error = HttpStatus[statusCode] || 'Error';
      }
    } else if (exception instanceof Error) {
      // Handle generic errors
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
      error = 'Internal Server Error';
      details =
        process.env.NODE_ENV === 'development'
          ? { stack: exception.stack }
          : undefined;

      // Log unexpected errors
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
        request.url,
      );
    } else {
      // Handle unknown errors
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
      error = 'Internal Server Error';

      this.logger.error(
        `Unknown error: ${JSON.stringify(exception)}`,
        undefined,
        request.url,
      );
    }

    // Build error response
    const errorResponse: ErrorResponseDto = {
      success: false,
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(details && { details }),
      ...(validationErrors && validationErrors.length > 0 && { errors: validationErrors }),
    };

    // Log error (except for client errors)
    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${statusCode} - ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else if (statusCode >= 400) {
      this.logger.warn(
        `${request.method} ${request.url} - ${statusCode} - ${message}`,
      );
    }

    response.status(statusCode).json(errorResponse);
  }
}

