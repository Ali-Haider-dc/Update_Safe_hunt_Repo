import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/typeorm/entities/UserEntity';
import { TransactionEntity } from 'src/transactions/entities/transaction/transaction';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepo: Repository<TransactionEntity>,
  ) {}

  async createTransaction(user: UserEntity, transaction_id: string, amount: number, type: string, status: string, currency: string) {
    const transaction = this.transactionRepo.create({
      user,
      transaction_id,
      amount,
      type,
      status,
      currency,
    });

    return this.transactionRepo.save(transaction);
  }
}
