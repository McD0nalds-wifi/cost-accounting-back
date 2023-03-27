import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transactions.model';
import { UsersService } from 'src/users/users.service';
import { Op } from 'sequelize';

const DEFAULT_OFFSET = 0;
const DEFAULT_DATE_TO = new Date();

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

  async getTransactions(
    email: string,
    dateFrom?: string,
    dateTo?: string,
    limit?: string,
    offset?: string,
  ) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    if (dateFrom) {
      const transactions = await this.transactionRepository.findAll({
        where: {
          date: {
            [Op.and]: {
              [Op.gte]: new Date(Number(dateFrom)),
              [Op.lte]: dateTo ? new Date(Number(dateTo)) : DEFAULT_DATE_TO,
            },
          },
        },
        offset: offset ? Number(offset) : DEFAULT_OFFSET,
        limit: limit ? Number(limit) : undefined,
      });

      return transactions;
    }

    const transactions = await this.transactionRepository.findAll({
      offset: offset ? Number(offset) : DEFAULT_OFFSET,
      limit: limit ? Number(limit) : undefined,
    });

    return transactions;
  }
}
