import { MigrationInterface, QueryRunner } from "typeorm";

// ~Migrations
export class AddAccountTable1735925145613 implements MigrationInterface {
    name = 'AddAccountTable1735925145613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "newfieldformigration" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "newfieldformigration"`);
    }

}
