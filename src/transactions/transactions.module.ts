import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from 'src/transactions/services/transactions.service';
import { TransactionEntity } from 'src/transactions/entities/transaction/transaction';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [TransactionsService],
  exports: [TransactionsService], // Export the service
})
export class TransactionsModule {}
