import { MigrationInterface, QueryRunner } from "typeorm";

export class EnablePgcrypto1699999999999 implements MigrationInterface {
    name = 'EnablePgcrypto1699999999999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP EXTENSION IF EXISTS pgcrypto`);
    }
}
