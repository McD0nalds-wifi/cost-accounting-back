import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './payments.model';
import { User } from '../users/users.model';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
  imports: [
    SequelizeModule.forFeature([Payment, User]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
