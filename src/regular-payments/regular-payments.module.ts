import { forwardRef, Module } from '@nestjs/common';
import { RegularPaymentsService } from './regular-payments.service';
import { RegularPaymentsController } from './regular-payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { RegularPayment } from './regular-payments.model';
import { User } from '../users/users.model';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [RegularPaymentsService],
  controllers: [RegularPaymentsController],
  imports: [
    SequelizeModule.forFeature([RegularPayment, User]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  exports: [RegularPaymentsService],
})
export class RegularPaymentsModule {}
