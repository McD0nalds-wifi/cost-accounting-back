import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
// import { UserTransactions } from './user-transactions.model';

interface TransactionCreationAttrs {
  name: string;
  business: string;
  category: string;
  type: string;
  amount: number;
  date: number;
}

@Table({ tableName: 'transactions' })
export class Transaction extends Model<Transaction, TransactionCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Яндекс подписка',
    description: 'Имя транзакции',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @ApiProperty({ example: 'Yandex Inc.', description: 'Название бизнеса' })
  @Column({ type: DataType.STRING, allowNull: false })
  business: string;

  @ApiProperty({
    example: 'subscriptions',
    description: 'Категория транзакции',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  category: string;

  @ApiProperty({ example: 'expenses', description: 'Зачисление или списание' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 299, description: 'Сумма зачисления или списания' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  amount: number;

  @ApiProperty({ example: 1677660803000, description: 'Дата в миллисекундах' })
  @Column({ type: DataType.BIGINT, allowNull: false })
  date: number;

  @BelongsTo(() => User, 'userId')
  user: User;
}
