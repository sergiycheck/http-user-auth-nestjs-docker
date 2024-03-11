import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpUserExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const message =
      exception instanceof HttpException
        ? exception.message || exception.message
        : 'Internal server error';

    const isDev = this.configService.get('NODE_ENV') === 'development';

    const devErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    const prodErrorResponse = {
      statusCode: status,
      message,
    };

    const errorResponse = isDev ? devErrorResponse : prodErrorResponse;

    response.status(status).json(errorResponse);
  }
}
