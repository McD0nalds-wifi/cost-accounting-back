import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { Payment } from '../payments/payments.model';
import { PaymentsModule } from 'src/payments/payments.module';
import { RegularPaymentsModule } from '../regular-payments/regular-payments.module';
import { RegularPayment } from '../regular-payments/regular-payments.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      UserRoles,
      Payment,
      RegularPayment,
    ]),
    RolesModule,
    PaymentsModule,
    RegularPaymentsModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
