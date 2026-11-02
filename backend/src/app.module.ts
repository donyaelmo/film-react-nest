import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const driver = configService.getOrThrow<string>('DATABASE_DRIVER');

        if (driver !== 'postgres') {
          throw new Error(`Unsupported database driver: ${driver}`);
        }

        return {
          type: driver,
          host: configService.getOrThrow<string>('DATABASE_HOST'),
          port: Number(configService.getOrThrow<string>('DATABASE_PORT')),
          database: configService.getOrThrow<string>('DATABASE_NAME'),
          username: configService.getOrThrow<string>('DATABASE_USERNAME'),
          password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),
    FilmsModule,
    OrderModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
