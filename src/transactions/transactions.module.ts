import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './transactions.model';
import { User } from '../users/users.model';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  imports: [
    SequelizeModule.forFeature([Transaction, User]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
