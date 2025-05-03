import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Transacao } from './entity/transacao.entity';
import { TransacaoController } from './transacao.controller';
import { TransacaoService } from './transacao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transacao]), AuthModule],
  controllers: [TransacaoController],
  providers: [TransacaoService],
})
export class TransacaoModule {}
