import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { TransferirDTO } from '../../src/transacao/dto/transferir.dto';
import { TransacaoController } from '../../src/transacao/transacao.controller';
import { CreateUsuarioDTO } from '../../src/usuario/dto/create-usuario.dto';
import { Usuario } from '../../src/usuario/entity/usuario.entity';
import { RepositoryHelper } from '../helpers/repository.helper';

const cadastrarUsuario = async (
  server: any,
  dto: CreateUsuarioDTO,
): Promise<Omit<Usuario, 'senha'>> => {
  const response = await request(server)
    .post(`/usuario`)
    .set('Content-Type', 'application/json')
    .send(dto)
    .expect(HttpStatus.CREATED);
  const body = response.body as Omit<Usuario, 'senha'>;

  return body;
};

const autenticarUsuario = async (
  server: any,
  email: string,
  senha: string,
): Promise<string> => {
  const response = await request(server)
    .post(`/auth/login`)
    .set('Content-Type', 'application/json')
    .send({ email, senha })
    .expect(HttpStatus.CREATED);
  const body = response.body as { accessToken: string };

  return body.accessToken;
};

describe(`${TransacaoController.name} - E2E`, () => {
  let app: INestApplication;
  let repositoryHelper: RepositoryHelper;
  let server: any;
  let dataSource: DataSource;
  let truncateTable: (...tableName: string[]) => Promise<void>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [RepositoryHelper],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    repositoryHelper = app.get<RepositoryHelper>(RepositoryHelper);

    await app.init();

    server = app.getHttpServer() as unknown;
  });

  beforeEach(async () => {
    dataSource = await repositoryHelper.loadDataSource();
    truncateTable = repositoryHelper.createTruncateTable(dataSource);
  });

  afterEach(async () => {
    await truncateTable('usuario', 'transacao');
    await dataSource.destroy();
  });

  describe('POST: /api/transacao/transferir', () => {
    it('deve retornar erro ao tentar transferir valor e o saldo do usuário ser insuficiente', async () => {
      const usuario1 = {
        nome: 'usuario1',
        email: 'usuario1@hotmail.com',
        senha: '12345',
      };
      const usuario2 = {
        nome: 'usuario2',
        email: 'usuario2@hotmail.com',
        senha: '12345',
      };

      const savedUsuario1 = await cadastrarUsuario(server, usuario1);
      const savedUsuario2 = await cadastrarUsuario(server, usuario2);
      const token = await autenticarUsuario(
        server,
        usuario1.email,
        usuario1.senha,
      );
      await dataSource.manager.update(Usuario, savedUsuario1.id, {
        saldo: '300',
      });
      const transferirDTO: TransferirDTO = {
        idDestinatario: savedUsuario2.id,
        valor: '500',
      };
      const response = await request(server)
        .post(`/transacao/transferir`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(transferirDTO)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        message: 'Saldo insuficiente',
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    it('deve transferir valor entre os usuários 1 e 2', async () => {
      const usuario1 = {
        nome: 'usuario1',
        email: 'usuario1@hotmail.com',
        senha: '12345',
      };
      const usuario2 = {
        nome: 'usuario2',
        email: 'usuario2@hotmail.com',
        senha: '12345',
      };

      const savedUsuario1 = await cadastrarUsuario(server, usuario1);
      const savedUsuario2 = await cadastrarUsuario(server, usuario2);
      const token = await autenticarUsuario(
        server,
        usuario1.email,
        usuario1.senha,
      );
      await dataSource.manager.update(Usuario, savedUsuario1.id, {
        saldo: '1000',
      });
      const transferirDTO: TransferirDTO = {
        idDestinatario: savedUsuario2.id,
        valor: '500',
      };
      const response = await request(server)
        .post(`/transacao/transferir`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(transferirDTO)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        id: expect.any(String) as unknown,
        valor: '500.0000',
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
