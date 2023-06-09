import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
// import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/payments.model';
import { ScheduleModule } from '@nestjs/schedule';
import { RegularPaymentsModule } from './regular-payments/regular-payments.module';
import { RegularPayment } from './regular-payments/regular-payments.model';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Payment, RegularPayment],
      autoLoadModels: true,
      dialectOptions: {
        supportBigNumbers: true,
      },
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PaymentsModule,
    RegularPaymentsModule,
    ScheduleModule.forRoot(),
    // FilesModule,
  ],
})
export class AppModule {}
