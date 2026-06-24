import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';

type RequestWithMeta = Request & {
  requestId?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<RequestWithMeta>();
    const requestId = request.requestId;

    if (exception instanceof ZodValidationException) {
      response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: exception.getZodError().issues.map((issue) => ({
          field: issue.path.join('.') || 'body',
          message: issue.message,
          code: issue.code
        })),
        path: request.url,
        timestamp: new Date().toISOString(),
        requestId
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
          ? String((exceptionResponse as { message: unknown }).message)
          : exception.message;

      response.status(status).json({
        success: false,
        message,
        errors: [],
        path: request.url,
        timestamp: new Date().toISOString(),
        requestId
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error',
      errors: [],
      path: request.url,
      timestamp: new Date().toISOString(),
      requestId
    });
  }
}
