
import { HttpModule } from '@nestjs/axios'
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'accounts_db',
      entities: [Account],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Account])
  ],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AppModule {}