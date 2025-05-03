import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransacaoTable1746230425595 implements MigrationInterface {
  name = 'CreateTransacaoTable1746230425595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transacao" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "valor" numeric(16,4) NOT NULL DEFAULT '0', "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "idRemetente" uuid, "idDestinatario" uuid, CONSTRAINT "PK_8a60051729f5d7e2d49c8fa91c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transacao" ADD CONSTRAINT "FK_651cb24b64f2639fffdb3e21f1e" FOREIGN KEY ("idRemetente") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transacao" ADD CONSTRAINT "FK_0d5c1ee09fdc76e3df596b3e56c" FOREIGN KEY ("idDestinatario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transacao" DROP CONSTRAINT "FK_0d5c1ee09fdc76e3df596b3e56c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transacao" DROP CONSTRAINT "FK_651cb24b64f2639fffdb3e21f1e"`,
    );
    await queryRunner.query(`DROP TABLE "transacao"`);
  }
}
