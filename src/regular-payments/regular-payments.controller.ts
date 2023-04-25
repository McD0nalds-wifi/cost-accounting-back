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
import { RegularPaymentsService } from './regular-payments.service';
import { CreateRegularPaymentDto } from './dto/create-regular-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegularPayment } from './regular-payments.model';

@Controller('regular-payments')
export class RegularPaymentsController {
  constructor(private regularPaymentsService: RegularPaymentsService) {}

  @ApiOperation({ summary: 'Создать регулярный платеж' })
  @ApiResponse({ status: 200, type: RegularPayment })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateRegularPaymentDto) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = req;

    return this.regularPaymentsService.createRegularPayment(dto, user.email);
  }

  @ApiOperation({ summary: 'Получить регулярные платежи пользователя' })
  @ApiResponse({ status: 200, type: [RegularPayment] })
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

    return this.regularPaymentsService.getRegularPayments(
      user.email,
      query.dateFrom,
      query.dateTo,
      query.limit,
      query.offset,
    );
  }
}
