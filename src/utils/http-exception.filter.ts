import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse() as any;
    const status = exception.getStatus();

    const resp = {
      statusCode: status,
      message: '',
      errors: [],
    };

    if (typeof exceptionResponse === 'string') resp.message = exceptionResponse;
    else {
      resp.errors = exceptionResponse.message;
      resp.message = exceptionResponse.error;
    }
    console.error(resp.message);
    response.status(status).json(resp);
  }
}
