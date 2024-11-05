import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
// import { StripeModule } from './stripe/stripe.module'; old method
import { StripeModule } from './auth/stripe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './typeorm/entities/UserEntity';
import { TransactionEntity } from 'src/transactions/entities/transaction/transaction';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response/response.interceptor';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, TransactionEntity],
      synchronize: true,
    }),
    AuthModule,
    StripeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
