import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';

interface RegularPaymentCreationAttrs {
  name: string;
  business: string;
  category: string;
  amount: number;
  date: number;
}

@Table({ tableName: 'regular-payments' })
export class RegularPayment extends Model<
  RegularPayment,
  RegularPaymentCreationAttrs
> {
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
    description: 'Имя платежа',
  })
  @Column({ type: DataType.STRING, allowNull: false })
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

  @ApiProperty({ example: 299, description: 'Сумма платежа' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  amount: number;

  @ApiProperty({ example: 1677660803, description: 'Дата в секундах' })
  @Column({ type: DataType.DATE, allowNull: false })
  date: number;

  @BelongsTo(() => User, 'userId')
  user: User;
}
