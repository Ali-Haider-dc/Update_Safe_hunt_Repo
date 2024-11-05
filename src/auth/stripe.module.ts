import { Module } from '@nestjs/common';
import { StripeService } from 'src/auth/controllers/auth/payments.controller';
// import { PaymentsController } from 'src/auth/dto/process-payment.dto'; Old method
import { PaymentsController } from 'src/auth/controllers/auth/payments.controller';
import { UserEntity } from 'src/typeorm/entities/UserEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from 'src/transactions/transactions.module'; 


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TransactionsModule
  ],
  providers: [StripeService],
  controllers: [PaymentsController],
})
export class StripeModule {}
