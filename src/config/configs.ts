import { registerAs } from '@nestjs/config';

export enum ConfigKey {
  App = 'APP',
  Db = 'DB',
  Type = 'TYPEORM',
}

export enum Environment {
  Local = 'local',
  Development = 'dev',
  Perf = 'perf',
  Production = 'production',
  Testing = 'testing',
}

const APPConfig = registerAs(
  ConfigKey.App, () => ({
    env:
      Environment[process.env.NODE_ENV as keyof typeof Environment] ||
      'dev',
    port: Number(process.env.APP_PORT),
    appName: process.env.APP_NAME,
  }),
);

const DBConfig = registerAs(
  ConfigKey.Db, () => ({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }),
);

const TypeOrmConfig = registerAs(ConfigKey.Type, () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'root',
  schema: process.env.DATABASE_SCHEMA || 'public',
  database: process.env.DATABASE|| 'postgres',
  dropSchema: process.env.DROP_SCHEMA === 'true',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: true,
}));

export const configurations = [APPConfig, DBConfig, TypeOrmConfig];
