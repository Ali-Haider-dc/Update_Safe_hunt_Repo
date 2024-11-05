import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/typeorm/entities/UserEntity';


@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, user => user.transactions)
  user: UserEntity;

  @Column()
  transaction_id: string;

  @Column()
  amount: number;

  @Column()
  type: string; // e.g., 'payment', 'refund', etc.

  @Column()
  status: string; // e.g., 'succeeded', 'failed', etc.

  @Column()
  currency: string; // e.g., 'usd', 'eur', etc.

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
