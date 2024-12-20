import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(
      `[REQUEST] ${method} ${originalUrl} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)}`
    );

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      this.logger.log(
        `[RESPONSE] ${method} ${originalUrl} - Status: ${res.statusCode} - Time: ${responseTime}ms`
      );
    });

    next();
  }
}