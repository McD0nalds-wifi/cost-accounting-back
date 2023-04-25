import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './payments.model';
import { UsersService } from 'src/users/users.service';
import { Op } from 'sequelize';

const DEFAULT_OFFSET = 0;
const DEFAULT_DATE_TO = new Date();

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment) private paymentRepository: typeof Payment,
    private usersService: UsersService,
  ) {}

  async createPayment(dto: CreatePaymentDto, email: string) {
    const payment = await this.paymentRepository.create(dto);
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    await payment.$set('user', user.id);

    if (user.payments && user.payments.length > 0) {
      await user.$add('payments', payment.id);
    } else {
      await user.$set('payments', [payment.id]);
    }

    user.balance =
      user.balance - payment.amount > 0 ? user.balance - payment.amount : 0;
    user.spending += payment.amount;

    await user.save();

    return payment;
  }

  async getPayments(
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

    const payments = await this.paymentRepository.findAll({
      where: dateFrom && {
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

    return payments.sort(
      (paymentA, paymentB) =>
        new Date(paymentB.date).getTime() - new Date(paymentA.date).getTime(),
    );
  }
}
