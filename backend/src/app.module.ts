import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from './database/entities/Administrator';
import { AppUser } from './database/entities/AppUser';
import { Attendance } from './database/entities/Attendance';
import { Equipment } from './database/entities/Equipment';
import { GymMember } from './database/entities/GymMember';
import { MemberMembership } from './database/entities/MemberMembership';
import { Membership } from './database/entities/Membership';
import { Payment } from './database/entities/Payment';
import { Perk } from './database/entities/Perk';
import { Report } from './database/entities/Report';
import { Reservation } from './database/entities/Reservation';
import { Service } from './database/entities/Service';
import { Trainer } from './database/entities/Trainer';
import { Training } from './database/entities/Training';
import { MembersModule } from './members/members.module';
import { MembershipsModule } from './memberships/memberships.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RootController } from './root.controller';
import { TrainersModule } from './trainers/trainers.module';
import { TrainingsModule } from './trainings/trainings.module';

const isEnabled = (value?: string) => value === 'true';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbSsl = isEnabled(configService.get<string>('DB_SSL'));
        const rejectUnauthorized = isEnabled(
          configService.get<string>('DB_SSL_REJECT_UNAUTHORIZED'),
        );

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          entities: [
            Administrator,
            AppUser,
            Attendance,
            Equipment,
            GymMember,
            MemberMembership,
            Membership,
            Payment,
            Perk,
            Report,
            Reservation,
            Service,
            Trainer,
            Training,
          ],
          synchronize: false,
          ssl: dbSsl
            ? {
                rejectUnauthorized,
              }
            : false,
        };
      },
    }),
    MembershipsModule,
    TrainingsModule,
    ReservationsModule,
    TrainersModule,
    MembersModule,
  ],
  controllers: [RootController],
})
export class AppModule {}
