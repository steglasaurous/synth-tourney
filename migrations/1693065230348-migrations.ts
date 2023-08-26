import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1693065230348 implements MigrationInterface {
  name = 'Migrations1693065230348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "synth_map" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "difficulty" varchar NOT NULL, "totalNotes" integer NOT NULL, "totalSpecials" integer NOT NULL, "hash" varchar NOT NULL, CONSTRAINT "UQ_237c95c6be517528800b59e48f1" UNIQUE ("hash"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "score" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "playerName" varchar NOT NULL, "score" integer NOT NULL, "perfectHits" integer NOT NULL, "goodHits" integer NOT NULL, "poorHits" integer NOT NULL, "longestStreak" integer NOT NULL, "maxMultiplier" integer NOT NULL, "specialsHit" integer NOT NULL, "scoreSubmissionId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "score_submission" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "submitter" varchar NOT NULL, "submittedOn" integer NOT NULL, "playInstanceId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "play_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timestamp" integer NOT NULL, "roomName" varchar, "synthMapId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_auth_source" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authSource" varchar NOT NULL, "authSourceUserId" varchar NOT NULL, "authSourceProfileData" text, "userId" integer, CONSTRAINT "UQ_15e21e7f29b09b5df04adde421e" UNIQUE ("userId", "authSource"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "displayName" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_score" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "playerName" varchar NOT NULL, "score" integer NOT NULL, "perfectHits" integer NOT NULL, "goodHits" integer NOT NULL, "poorHits" integer NOT NULL, "longestStreak" integer NOT NULL, "maxMultiplier" integer NOT NULL, "specialsHit" integer NOT NULL, "scoreSubmissionId" integer, CONSTRAINT "FK_279c9d40e7baf84b1e5fdacaa22" FOREIGN KEY ("scoreSubmissionId") REFERENCES "score_submission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_score"("id", "playerName", "score", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId") SELECT "id", "playerName", "score", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId" FROM "score"`,
    );
    await queryRunner.query(`DROP TABLE "score"`);
    await queryRunner.query(`ALTER TABLE "temporary_score" RENAME TO "score"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_score_submission" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "submitter" varchar NOT NULL, "submittedOn" integer NOT NULL, "playInstanceId" integer, CONSTRAINT "FK_53a2b4a89be85b0dce89028a04c" FOREIGN KEY ("playInstanceId") REFERENCES "play_instance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_score_submission"("id", "submitter", "submittedOn", "playInstanceId") SELECT "id", "submitter", "submittedOn", "playInstanceId" FROM "score_submission"`,
    );
    await queryRunner.query(`DROP TABLE "score_submission"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_score_submission" RENAME TO "score_submission"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_play_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timestamp" integer NOT NULL, "roomName" varchar, "synthMapId" integer, CONSTRAINT "FK_03d7095e96cfa5c4cfd7ec29fae" FOREIGN KEY ("synthMapId") REFERENCES "synth_map" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_play_instance"("id", "timestamp", "roomName", "synthMapId") SELECT "id", "timestamp", "roomName", "synthMapId" FROM "play_instance"`,
    );
    await queryRunner.query(`DROP TABLE "play_instance"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_play_instance" RENAME TO "play_instance"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user_auth_source" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authSource" varchar NOT NULL, "authSourceUserId" varchar NOT NULL, "authSourceProfileData" text, "userId" integer, CONSTRAINT "UQ_15e21e7f29b09b5df04adde421e" UNIQUE ("userId", "authSource"), CONSTRAINT "FK_2d0e40a8d133066614dd2c22e9c" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user_auth_source"("id", "authSource", "authSourceUserId", "authSourceProfileData", "userId") SELECT "id", "authSource", "authSourceUserId", "authSourceProfileData", "userId" FROM "user_auth_source"`,
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
      `CREATE TABLE "user_auth_source" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authSource" varchar NOT NULL, "authSourceUserId" varchar NOT NULL, "authSourceProfileData" text, "userId" integer, CONSTRAINT "UQ_15e21e7f29b09b5df04adde421e" UNIQUE ("userId", "authSource"))`,
    );
    await queryRunner.query(
      `INSERT INTO "user_auth_source"("id", "authSource", "authSourceUserId", "authSourceProfileData", "userId") SELECT "id", "authSource", "authSourceUserId", "authSourceProfileData", "userId" FROM "temporary_user_auth_source"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user_auth_source"`);
    await queryRunner.query(
      `ALTER TABLE "play_instance" RENAME TO "temporary_play_instance"`,
    );
    await queryRunner.query(
      `CREATE TABLE "play_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timestamp" integer NOT NULL, "roomName" varchar, "synthMapId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "play_instance"("id", "timestamp", "roomName", "synthMapId") SELECT "id", "timestamp", "roomName", "synthMapId" FROM "temporary_play_instance"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_play_instance"`);
    await queryRunner.query(
      `ALTER TABLE "score_submission" RENAME TO "temporary_score_submission"`,
    );
    await queryRunner.query(
      `CREATE TABLE "score_submission" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "submitter" varchar NOT NULL, "submittedOn" integer NOT NULL, "playInstanceId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "score_submission"("id", "submitter", "submittedOn", "playInstanceId") SELECT "id", "submitter", "submittedOn", "playInstanceId" FROM "temporary_score_submission"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_score_submission"`);
    await queryRunner.query(`ALTER TABLE "score" RENAME TO "temporary_score"`);
    await queryRunner.query(
      `CREATE TABLE "score" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "playerName" varchar NOT NULL, "score" integer NOT NULL, "perfectHits" integer NOT NULL, "goodHits" integer NOT NULL, "poorHits" integer NOT NULL, "longestStreak" integer NOT NULL, "maxMultiplier" integer NOT NULL, "specialsHit" integer NOT NULL, "scoreSubmissionId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "score"("id", "playerName", "score", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId") SELECT "id", "playerName", "score", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId" FROM "temporary_score"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_score"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_auth_source"`);
    await queryRunner.query(`DROP TABLE "play_instance"`);
    await queryRunner.query(`DROP TABLE "score_submission"`);
    await queryRunner.query(`DROP TABLE "score"`);
    await queryRunner.query(`DROP TABLE "synth_map"`);
  }
}
