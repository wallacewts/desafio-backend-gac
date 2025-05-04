import { Test, TestingModule } from '@nestjs/testing';
import { TransacaoService } from './transacao.service';
import { DataSource, InsertResult } from 'typeorm';
import {
  mockDataSource,
  mockQueryRunner,
} from '../shared/mocks/providers.mock';
import { TransferirDTO } from './dto/transferir.dto';
import { Transacao } from './entity/transacao.entity';

describe('TransacaoService', () => {
  let service: TransacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransacaoService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TransacaoService>(TransacaoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transferir', () => {
    it('deve retornar erro ao tentar transferir valor e o saldo do usuário ser insuficiente', async () => {
      const mockTransferirDTO: TransferirDTO = {
        idDestinatario: 'id',
        valor: '500',
      };
      const mockIdUsuarioAutenticado = 'id';
      jest
        .spyOn(mockQueryRunner.manager, 'findOneOrFail')
        .mockResolvedValueOnce({
          saldo: '0.0000',
        });

      await expect(
        service.transferir(mockTransferirDTO, mockIdUsuarioAutenticado),
      ).rejects.toThrow('Saldo insuficiente');
    });

    it('deve inserir transacao corretamente', async () => {
      const mockTransferirDTO: TransferirDTO = {
        idDestinatario: 'id',
        valor: '500',
      };
      const mockIdUsuarioAutenticado = 'id';
      jest
        .spyOn(mockQueryRunner.manager, 'findOneOrFail')
        .mockResolvedValueOnce({
          id: 'idRemetente',
          saldo: '1000.0000',
        })
        .mockResolvedValueOnce({
          id: 'idDestinatario',
          saldo: '0.0000',
        });
      const spy = jest
        .spyOn(mockQueryRunner.manager, 'insert')
        .mockResolvedValueOnce({
          raw: [{}],
        } as InsertResult);

      await service.transferir(mockTransferirDTO, mockIdUsuarioAutenticado);

      expect(spy).toHaveBeenCalledWith(Transacao, {
        destinatario: expect.objectContaining({
          id: 'idDestinatario',
        }),
        remetente: expect.objectContaining({
          id: 'idRemetente',
        }),
        valor: '500',
      });
    });
  });
});
