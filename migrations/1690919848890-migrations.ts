import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1690919848890 implements MigrationInterface {
  name = 'Migration1690919848890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_play_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timestamp" integer NOT NULL, "roomName" varchar, "synthMapId" integer, CONSTRAINT "FK_03d7095e96cfa5c4cfd7ec29fae" FOREIGN KEY ("synthMapId") REFERENCES "synth_map" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_play_instance"("id", "timestamp", "roomName", "synthMapId") SELECT "id", "timestamp", "roomId", "synthMapId" FROM "play_instance"`,
    );
    await queryRunner.query(`DROP TABLE "play_instance"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_play_instance" RENAME TO "play_instance"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "play_instance" RENAME TO "temporary_play_instance"`,
    );
    await queryRunner.query(
      `CREATE TABLE "play_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timestamp" integer NOT NULL, "roomId" varchar, "synthMapId" integer, CONSTRAINT "FK_03d7095e96cfa5c4cfd7ec29fae" FOREIGN KEY ("synthMapId") REFERENCES "synth_map" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "play_instance"("id", "timestamp", "roomId", "synthMapId") SELECT "id", "timestamp", "roomName", "synthMapId" FROM "temporary_play_instance"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_play_instance"`);
  }
}
