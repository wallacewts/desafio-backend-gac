import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DataBaseModule } from './database/database.module';
import { DataBaseService } from './database/database.service';
import { TransacaoModule } from './transacao/transacao.module';
import { UsuarioModule } from './usuario/usuario.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, DataBaseModule],
      useClass: DataBaseService,
    }),
    DataBaseModule,
    AuthModule,
    UsuarioModule,
    TransacaoModule,
  ],
})
export class AppModule {}
