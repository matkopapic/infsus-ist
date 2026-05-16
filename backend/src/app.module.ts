import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MembersModule } from './members/members.module';
import { MembershipsModule } from './memberships/memberships.module';
import { ReservationsModule } from './reservations/reservations.module';
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
          synchronize: false,
          ssl: dbSsl
            ? {
                rejectUnauthorized,
              }
            : false,
        };
      },
    }),
    DatabaseModule,
    MembershipsModule,
    TrainingsModule,
    ReservationsModule,
    TrainersModule,
    MembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
