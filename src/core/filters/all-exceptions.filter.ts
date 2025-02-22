import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as R from 'ramda';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
      message: R.cond([
        [R.is(String), R.identity],
        [R.prop('message'), R.prop('message')],
        [R.T, R.always('Something went wrong')],
      ])(message),
    };

    Logger.error(
      `Error: ${status} - ${req.method} ${req.url} - ${JSON.stringify(
        message,
      )}`,
    );

    res.status(status).json(errorResponse);
  }
}
