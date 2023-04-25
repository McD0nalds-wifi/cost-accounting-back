import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Payment } from './payments.model';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @ApiOperation({ summary: 'Создать платеж' })
  @ApiResponse({ status: 200, type: Payment })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() dto: CreatePaymentDto) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = req;

    return this.paymentService.createPayment(dto, user.email);
  }

  @ApiOperation({ summary: 'Получить список расходов пользователя' })
  @ApiResponse({ status: 200, type: [Payment] })
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(
    @Req() req: Request,
    @Query()
    query: {
      dateFrom?: string;
      dateTo?: string;
      limit?: string;
      offset?: string;
    },
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = req;

    return this.paymentService.getPayments(
      user.email,
      query.dateFrom,
      query.dateTo,
      query.limit,
      query.offset,
    );
  }
}
