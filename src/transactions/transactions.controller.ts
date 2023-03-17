import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateTransactionDto) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = req;

    return this.transactionService.createTransaction(dto, user.email);
  }
}
