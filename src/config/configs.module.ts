import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurations } from './configs';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type TypeOrmConfig = {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  schema: string;
  database: string;
  dropSchema: boolean;
  entities: string[];
  migrations: string[];
  autoLoadEntities: boolean;
  synchronize: boolean;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [...configurations],
      isGlobal: true,
      // validate: validateConfig, // config validator
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const dbConfig = configService.get<TypeOrmConfig>('TYPEORM');

        if (!dbConfig) {
          throw new Error('Database configuration not found');
        }
        try {
          const dataSource = new DataSource(dbConfig);

          await dataSource.initialize();
          console.log('Database connected successfully');
          await dataSource.destroy();

          return {
            ...dbConfig,
            logging: false,
          } as TypeOrmModuleOptions;
        } catch (error) {
          console.error('Database connection error:', error);
          throw new Error('Database connection error');
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class ConfigsModule {}
