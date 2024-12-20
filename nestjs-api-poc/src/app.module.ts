
import { HttpModule } from '@nestjs/axios'
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggingMiddleware)
      .forRoutes('*');
  }
}