import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookings1700000000000 implements MigrationInterface {
    name = 'CreateBookings1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "bookings" (
          "id" uuid NOT NULL DEFAULT gen_random_uuid(),
          "clientName" character varying(80) NOT NULL,
          "clientPhone" character varying(16) NOT NULL,
          "startsAt" TIMESTAMPTZ NOT NULL,
          "service" character varying(16) NOT NULL,
          "notes" text,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT "PK_bookings_id" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_bookings_startsAt" ON "bookings" ("startsAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bookings_startsAt"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "bookings"`);
    }
}
