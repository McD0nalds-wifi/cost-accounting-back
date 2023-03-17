import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transactions.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction) private transactionRepository: typeof Transaction,
    private usersService: UsersService,
  ) {}
  async createTransaction(dto: CreateTransactionDto, email: string) {
    const transaction = await this.transactionRepository.create(dto);
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    await transaction.$set('user', user.id);

    if (user.transactions && user.transactions.length > 0) {
      await user.$add('transactions', transaction.id);
    } else {
      await user.$set('transactions', [transaction.id]);
    }

    return transaction;
  }
}
