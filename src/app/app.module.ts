import { Module } from '@nestjs/common';
// import { CoreModule } from '@app/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppConfigModule } from '@config/app.config.module';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from '@app/modules/health/health.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from '../core/shared.module';
import { CoreModule } from './core.module';
import { AppConfigModule } from '../config/app.config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

/** This is a TypeScript module that imports various modules and sets up a TypeORM connection using
configuration values obtained from a ConfigService. */
@Module({
  imports: [
    AppConfigModule,
    CoreModule,
    SharedModule,
    ThrottlerModule.forRoot(
      [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100
        }
      ]
    ),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: configService.get<'sqlite' | 'postgres'>('db.type'),
    //     host: configService.get<string>('db.host'),
    //     port: configService.get<number>('db.port'),
    //     username: configService.get<string>('db.user'),
    //     password: configService.get<string>('db.password'),
    //     database: configService.get<string>('db.name'),
    //     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    //     synchronize: configService.get<boolean>('db.synchronize'),
    //   }),
    //   inject: [ConfigService],
    // }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'sampledb',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    // TypeOrmModule.forRootAsync(dataSource),
    HealthModule,
  ],
})
export class AppModule {}
