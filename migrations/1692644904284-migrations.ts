import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1692644904284 implements MigrationInterface {
  name = 'Migration1692644904284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_auth_source" ("user" integer PRIMARY KEY NOT NULL, "authSource" varchar NOT NULL, "authSourceUserId" varchar NOT NULL, "authSourceProfileData" json NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "displayName" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_synth_map" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "difficulty" varchar NOT NULL, "totalNotes" integer NOT NULL, "totalSpecials" integer NOT NULL, "hash" varchar NOT NULL, CONSTRAINT "UQ_5a4b011bcd99184fda972e2d54c" UNIQUE ("hash"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_synth_map"("id", "title", "artist", "mapper", "difficulty", "totalNotes", "totalSpecials", "hash") SELECT "id", "title", "artist", "mapper", "difficulty", "totalNotes", "totalSpecials", "hash" FROM "synth_map"`,
    );
    await queryRunner.query(`DROP TABLE "synth_map"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_synth_map" RENAME TO "synth_map"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user_auth_source" ("user" integer PRIMARY KEY NOT NULL, "authSource" varchar NOT NULL, "authSourceUserId" varchar NOT NULL, "authSourceProfileData" json NOT NULL, "userId" integer, CONSTRAINT "FK_2d0e40a8d133066614dd2c22e9c" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user_auth_source"("user", "authSource", "authSourceUserId", "authSourceProfileData", "userId") SELECT "user", "authSource", "authSourceUserId", "authSourceProfileData", "userId" FROM "user_auth_source"`,
    );
    await queryRunner.query(`DROP TABLE "user_auth_source"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_user_auth_source" RENAME TO "user_auth_source"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_auth_source" RENAME TO "temporary_user_auth_source"`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_auth_source" ("user" integer PRIMARY KEY NOT NULL, "authSource" varchar NOT NULL, "authSourceUserId" varchar NOT NULL, "authSourceProfileData" json NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "user_auth_source"("user", "authSource", "authSourceUserId", "authSourceProfileData", "userId") SELECT "user", "authSource", "authSourceUserId", "authSourceProfileData", "userId" FROM "temporary_user_auth_source"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user_auth_source"`);
    await queryRunner.query(
      `ALTER TABLE "synth_map" RENAME TO "temporary_synth_map"`,
    );
    await queryRunner.query(
      `CREATE TABLE "synth_map" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "map_id" varchar NOT NULL DEFAULT (''), "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "difficulty" varchar NOT NULL, "totalNotes" integer NOT NULL, "totalSpecials" integer NOT NULL, "hash" varchar NOT NULL, CONSTRAINT "UQ_5a4b011bcd99184fda972e2d54c" UNIQUE ("hash"))`,
    );
    await queryRunner.query(
      `INSERT INTO "synth_map"("id", "title", "artist", "mapper", "difficulty", "totalNotes", "totalSpecials", "hash") SELECT "id", "title", "artist", "mapper", "difficulty", "totalNotes", "totalSpecials", "hash" FROM "temporary_synth_map"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_synth_map"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_auth_source"`);
  }
}
