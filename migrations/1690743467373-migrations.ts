import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1690743467373 implements MigrationInterface {
    name = 'Migrations1690743467373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_synth_map" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "map_id" varchar NOT NULL DEFAULT (''), "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "difficulty" varchar NOT NULL, "totalNotes" integer NOT NULL, "totalSpecials" integer NOT NULL, "hash" varchar NOT NULL, CONSTRAINT "UQ_5a4b011bcd99184fda972e2d54c" UNIQUE ("hash"))`);
        await queryRunner.query(`INSERT INTO "temporary_synth_map"("id", "map_id", "title", "artist", "mapper", "difficulty", "totalNotes", "totalSpecials") SELECT "id", "map_id", "title", "artist", "mapper", "difficulty", "totalNotes", "totalSpecials" FROM "synth_map"`);
        await queryRunner.query(`DROP TABLE "synth_map"`);
        await queryRunner.query(`ALTER TABLE "temporary_synth_map" RENAME TO "synth_map"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "synth_map" RENAME TO "temporary_synth_map"`);
        await queryRunner.query(`CREATE TABLE "synth_map" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "map_id" varchar NOT NULL DEFAULT (''), "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "difficulty" varchar NOT NULL, "totalNotes" integer NOT NULL, "totalSpecials" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "synth_map"("id", "map_id", "title", "artist", "mapper", "difficulty", "totalNotes", "totalSpecials") SELECT "id", "map_id", "title", "artist", "mapper", "difficulty", "totalNotes", "totalSpecials" FROM "temporary_synth_map"`);
        await queryRunner.query(`DROP TABLE "temporary_synth_map"`);
    }
}
