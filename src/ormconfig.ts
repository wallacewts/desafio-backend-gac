import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const ENV = !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}`;
const path = resolve(__dirname, `../${ENV}`);
const envConfig = dotenv.parse(readFileSync(path));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const config: DataSourceOptions & { seeds: string[]; factories: string[] } = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5050,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_DATABASE || 'localhost',
  migrationsTableName: 'migrations',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  migrations: [__dirname + '/migration/**/*{.ts,.js}'],
  seeds: [__dirname + '/seeds/seeds/**/*{.ts,.js}'],
  factories: [__dirname + '/seeds/factories/**/*{.ts,.js}'],
};

export default new DataSource(config);

export const typeOrmConfig: TypeOrmModuleOptions = config;
