import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { AxiosError } from 'axios';
  
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let details = null;
  
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        message = exception.message;
      } else if (exception?.isAxiosError) {
        const axiosError = exception as AxiosError;
        status = axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'External API Error';
        details = {
          message: axiosError.message,
          code: axiosError.code,
          response: axiosError.response?.data
        };
      }
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
        message,
        details
      });
    }
  }