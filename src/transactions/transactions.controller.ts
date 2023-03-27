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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Transaction } from './transactions.model';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @ApiOperation({ summary: 'Создать транзакцию' })
  @ApiResponse({ status: 200, type: Transaction })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateTransactionDto) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = req;

    return this.transactionService.createTransaction(dto, user.email);
  }

  @ApiOperation({ summary: 'Получить транзакции пользователя' })
  @ApiResponse({ status: 200, type: [Transaction] })
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

    return this.transactionService.getTransactions(
      user.email,
      query.dateFrom,
      query.dateTo,
      query.limit,
      query.offset,
    );
  }
}
