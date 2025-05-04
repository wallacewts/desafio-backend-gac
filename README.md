# Desafio Back-end GAC

## AMBIENTES

### DEV

    $ docker compose up

#### INSTALAR DEPENDÊNCIAS E CRIAR NOVAS FUNCIONALIDADES

```bash
$ docker compose exec api-test sh
$ nest g resource users
```

### TEST

- DEV

  Executar container em desenvolvimento com o comando:

  ```bash
  $ TEST=dev docker compose -f docker-compose.check.yml up
  ```

  Com o container de desenvolvimento em execução para rodar os tests UNIT ou E2E , acesse o container com o comando:

  ```bash
  $ docker compose exec api-test sh
  ```

- UNIT

  Com o container de desenvolvimento em execução, acesse o container com o comando:

  ```bash
  $ docker compose exec api-test sh
  ```

  E execute os comandos de teste disponíveis no arquivo **_package.json_**, por exemplo:

  ```bash
  $ npm run test
  ```

  - Execução única
    Para apenas rodar os testes unitários e sair do container rode o comando abaixo:
    `bash
$ TEST=unit docker compose -f docker-compose.check.yml up --abort-on-container-exit --exit-code-from api-test
`

- E2E

  Suba o container específico para testes e2e, através do comando:

  ```bash
  $ docker-compose -f docker-compose.check.yml up
  ```

  E execute os comandos de teste e2e disponíveis no arquivo **_package.json_**, por exemplo:

  ```bash
  $ npm run test:e2e
  ```

  - Execução única
    Para apenas rodar os testes unitários e sair do container rode o comando abaixo:
    `bash
$ TEST=e2e docker compose -f docker-compose.check.yml up --abort-on-container-exit --exit-code-from api-test
`

## Monitoramento e Logs

Importe a collection do postman localizado na raiz do projeto nomeada como `GAC.postman_collection.json` e siga os passos abaixos para acessar a aplicação de monitoramento:

- Execute o docker compose de teste no modo de desenvolvimento: `TEST=dev docker compose -f docker-compose.check.yml up`
- Execute alguma requisição definida na collection do postman e observe que dentro de alguns segundos será exibido logs do [OpenTelemetry](https://opentelemetry.io/docs/getting-started/dev/)
- Acesse o endereço `http://localhost:8081` e selecione `gac-api` como serviço na página inicial do [JeagerUI](https://www.jaegertracing.io/docs/2.5/getting-started/)
- Selecione a opção `all` no combo box de operações
- Pressione o botão `Find Traces` e selecione a requisição

## ENVIRONMENTS VARIABLES

| ENV         | Descrição                                     | Valor Padrão                                                 |
| ----------- | --------------------------------------------- | ------------------------------------------------------------ |
| DB_HOST     | Host do banco de dados                        | db-test                                                      |
| DB_USERNAME | Nome de usuário do banco de dados             | postgres                                                     |
| DB_PASS     | Senha do banco de dados                       | postgres                                                     |
| DB_DATABASE | Nome do banco de dados                        | gac                                                          |
| DB_PORT     | Porta de conexão com o banco de dados         | 5050                                                         |
| JWT_SECRET  | Chave secreta para geração do Jason Web Token | $2y$10$sjgGPIn/BPQD8WH.z2kViuIZtEgLEqYyFUEVK3AC6hNA.y0TXmSE2 |

## Referências

[JeagerUI](https://www.jaegertracing.io/docs/2.5/getting-started/)
[OpenTelemetry](https://opentelemetry.io/docs/getting-started/dev/)
