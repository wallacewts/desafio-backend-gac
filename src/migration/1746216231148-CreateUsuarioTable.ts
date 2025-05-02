import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsuarioTable1746216231148 implements MigrationInterface {
  name = 'CreateUsuarioTable1746216231148';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "usuario" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(60) NOT NULL, "email" character varying(100) NOT NULL, "senha" character varying(100) NOT NULL, "saldo" numeric(16,4) NOT NULL DEFAULT '0', CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuario"`);
  }
}
