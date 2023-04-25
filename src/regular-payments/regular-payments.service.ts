import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRegularPaymentDto } from './dto/create-regular-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { RegularPayment } from './regular-payments.model';
import { UsersService } from 'src/users/users.service';
import { Op } from 'sequelize';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';

const DEFAULT_OFFSET = 0;
const DEFAULT_DATE_TO = new Date();

@Injectable()
export class RegularPaymentsService {
  constructor(
    @InjectModel(RegularPayment)
    private regularPaymentRepository: typeof RegularPayment,
    private usersService: UsersService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async createRegularPayment(dto: CreateRegularPaymentDto, email: string) {
    const regularPayment = await this.regularPaymentRepository.create(dto);
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    await regularPayment.$set('user', user.id);

    if (user.regularPayments && user.regularPayments.length > 0) {
      await user.$add('regularPayments', regularPayment.id);
    } else {
      await user.$set('regularPayments', [regularPayment.id]);
    }

    await user.save();

    this.addDeferredPayment(email, regularPayment.id, '5');

    return regularPayment;
  }

  addDeferredPayment(
    userEmail: string,
    regularPaymentId: number,
    seconds: string,
  ) {
    const job = new CronJob(`${seconds} * * * * *`, () =>
      this.makeDeferredPayment(userEmail, regularPaymentId),
    );

    this.schedulerRegistry.addCronJob(`${regularPaymentId}`, job);
    job.start();
  }

  async makeDeferredPayment(userEmail: string, regularPaymentId: number) {
    const user = await this.usersService.getUserByEmail(userEmail);
    const regularPayment = await this.regularPaymentRepository.findByPk(
      regularPaymentId,
    );

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    if (!regularPayment) {
      throw new HttpException('Платеж не найден', HttpStatus.NOT_FOUND);
    }

    user.balance -= regularPayment.amount;
    user.spending += regularPayment.amount;

    await user.save();
  }

  async getRegularPayments(
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
      const regularPayments = await this.regularPaymentRepository.findAll({
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

      return regularPayments;
    }

    const regularPayments = await this.regularPaymentRepository.findAll({
      offset: offset ? Number(offset) : DEFAULT_OFFSET,
      limit: limit ? Number(limit) : undefined,
    });

    return regularPayments;
  }
}
