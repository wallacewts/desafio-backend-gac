import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Usuario } from '../usuario/entity/usuario.entity';
import { TransferirDTO } from './dto/transferir.dto';
import { Transacao } from './entity/transacao.entity';

@Injectable()
export class TransacaoService {
  #logger = new Logger(TransacaoService.name);
  @InjectDataSource()
  private readonly dataSource: DataSource;

  async transferir(transferirDTO: TransferirDTO, idUsuarioAutenticado: string) {
    const runner = this.dataSource.createQueryRunner();

    try {
      await runner.connect();
      await runner.startTransaction();

      const remetente = await runner.manager.findOneOrFail(Usuario, {
        where: {
          id: idUsuarioAutenticado,
        },
        loadEagerRelations: false,
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (Number(remetente.saldo) < Number(transferirDTO.valor)) {
        throw new BadRequestException('Saldo insuficiente');
      }

      const destinatario = await runner.manager.findOneOrFail(Usuario, {
        where: {
          id: transferirDTO.idDestinatario,
        },
        loadEagerRelations: false,
        lock: {
          mode: 'pessimistic_write',
        },
      });

      const novoSaldoDestinatario = (
        Number(destinatario.saldo) + Number(transferirDTO.valor)
      ).toFixed(4);
      await runner.manager.update(Usuario, destinatario.id, {
        saldo: novoSaldoDestinatario,
      });

      const novoSaldoRemetente = (
        Number(remetente.saldo) - Number(transferirDTO.valor)
      ).toFixed(4);
      await runner.manager.update(Usuario, remetente.id, {
        saldo: novoSaldoRemetente,
      });

      const transacao = await runner.manager.insert(Transacao, {
        destinatario,
        remetente,
        valor: transferirDTO.valor,
      });

      await runner.commitTransaction();

      return transacao.raw as Transacao;
    } catch (error) {
      this.#logger.error(error);
      await runner.rollbackTransaction();
      throw error;
    } finally {
      await runner.release();
    }
  }

  async reverter(id: string, idUsuarioAutenticado: string) {
    const runner = this.dataSource.createQueryRunner();

    try {
      await runner.connect();
      await runner.startTransaction();

      const transacao = await runner.manager.findOneOrFail(Transacao, {
        where: {
          id,
          remetente: {
            id: idUsuarioAutenticado,
          },
        },
        relations: ['remetente', 'destinatario'],
      });

      const destinatario = await runner.manager.findOneOrFail(Usuario, {
        where: {
          id: transacao.destinatario.id,
        },
        loadEagerRelations: false,
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (Number(destinatario.saldo) < Number(transacao.valor)) {
        throw new BadRequestException('Não foi possível reverter a transação');
      }

      const remetente = await runner.manager.findOneOrFail(Usuario, {
        where: {
          id: transacao.remetente.id,
        },
        loadEagerRelations: false,
        lock: {
          mode: 'pessimistic_write',
        },
      });

      const novoSaldoDestinatario = (
        Number(destinatario.saldo) - Number(transacao.valor)
      ).toFixed(4);
      await runner.manager.update(Usuario, destinatario.id, {
        saldo: novoSaldoDestinatario,
      });

      const novoSaldoRemetente = (
        Number(remetente.saldo) + Number(transacao.valor)
      ).toFixed(4);
      await runner.manager.update(Usuario, remetente.id, {
        saldo: novoSaldoRemetente,
      });
      await runner.manager.delete(Transacao, transacao.id);

      await runner.commitTransaction();
    } catch (error) {
      this.#logger.error(error);
      await runner.rollbackTransaction();
      throw error;
    } finally {
      await runner.release();
    }
  }
}
