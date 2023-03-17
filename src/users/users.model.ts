import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';
import { Transaction } from 'src/transactions/transactions.model';

interface UserCreationAttrs {
  email: string;
  fullname: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'user@mail.ru', description: 'Почтовый адрес' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({
    example: 'Иван Петров',
    description: 'Полное имя пользователя',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  readonly fullname: string;

  @ApiProperty({ example: '12345678', description: 'Пароль' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: 12000, description: 'Баланс пользователя' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  balance: number;

  @ApiProperty({ example: 6400, description: 'Расходы пользователя' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  spending: number;

  @ApiProperty({ example: 2000, description: 'Сбережения пользователя' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  saved: number;

  @ApiProperty({ example: 'true', description: 'Забанен или нет' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @ApiProperty({ example: 'За хулиганство', description: 'Причина блокировки' })
  @Column({ type: DataType.STRING, allowNull: true })
  banReason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasMany(() => Transaction, 'transactionId')
  transactions: Transaction[];
}
