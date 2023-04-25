import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';

interface PaymentCreationAttrs {
  name: string;
  business: string;
  category: string;
  type: string;
  amount: number;
  date: number;
}

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment, PaymentCreationAttrs> {
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

  @ApiProperty({ example: 299, description: 'Сумма зачисления или списания' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  amount: number;

  @ApiProperty({ example: 1677660803, description: 'Дата в секундах' })
  @Column({ type: DataType.DATE, allowNull: false })
  date: number;

  @BelongsTo(() => User, 'userId')
  user: User;
}
