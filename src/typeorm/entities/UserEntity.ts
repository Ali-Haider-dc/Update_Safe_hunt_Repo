import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { TransactionEntity } from 'src/transactions/entities/transaction/transaction';


@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, length: 255 })
  displayname: string;

  @Column({ unique: true, length: 255 })
  username: string;

  @Column({ unique: true, length: 255, nullable: true })
  email: string;

  @Column({ unique: true, length: 255, nullable: true })
  phonenumber: string;

  @Column({ type: 'varchar', length: 50, default: 'inactive' })
  status: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otpexpiry?: Date;

  @Column({ length: 255 })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  stripe_customer_id: string;

  @Column({ nullable: true })
  stripe_card_id: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpires: Date;

  @OneToMany(() => TransactionEntity, transaction => transaction.user)
  transactions: TransactionEntity[];


}
