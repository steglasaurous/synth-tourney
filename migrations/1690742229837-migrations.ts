import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1690742229837 implements MigrationInterface {
    name = 'Migrations1690742229837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "synth_map" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "map_id" varchar NOT NULL DEFAULT (''), "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "difficulty" varchar NOT NULL, "totalNotes" integer NOT NULL, "totalSpecials" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "score" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "playerName" varchar NOT NULL, "score" integer NOT NULL, "totalNotesHit" integer NOT NULL, "perfectHits" integer NOT NULL, "goodHits" integer NOT NULL, "poorHits" integer NOT NULL, "longestStreak" integer NOT NULL, "maxMultiplier" integer NOT NULL, "specialsHit" integer NOT NULL, "scoreSubmissionId" integer)`);
        await queryRunner.query(`CREATE TABLE "score_submission" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "submitter" varchar NOT NULL, "submittedOn" integer NOT NULL, "playInstanceId" integer)`);
        await queryRunner.query(`CREATE TABLE "play_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timestamp" integer NOT NULL, "roomId" varchar, "synthMapId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_score" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "playerName" varchar NOT NULL, "score" integer NOT NULL, "totalNotesHit" integer NOT NULL, "perfectHits" integer NOT NULL, "goodHits" integer NOT NULL, "poorHits" integer NOT NULL, "longestStreak" integer NOT NULL, "maxMultiplier" integer NOT NULL, "specialsHit" integer NOT NULL, "scoreSubmissionId" integer, CONSTRAINT "FK_279c9d40e7baf84b1e5fdacaa22" FOREIGN KEY ("scoreSubmissionId") REFERENCES "score_submission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_score"("id", "playerName", "score", "totalNotesHit", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId") SELECT "id", "playerName", "score", "totalNotesHit", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId" FROM "score"`);
        await queryRunner.query(`DROP TABLE "score"`);
        await queryRunner.query(`ALTER TABLE "temporary_score" RENAME TO "score"`);
        await queryRunner.query(`CREATE TABLE "temporary_score_submission" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "submitter" varchar NOT NULL, "submittedOn" integer NOT NULL, "playInstanceId" integer, CONSTRAINT "FK_53a2b4a89be85b0dce89028a04c" FOREIGN KEY ("playInstanceId") REFERENCES "play_instance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_score_submission"("id", "submitter", "submittedOn", "playInstanceId") SELECT "id", "submitter", "submittedOn", "playInstanceId" FROM "score_submission"`);
        await queryRunner.query(`DROP TABLE "score_submission"`);
        await queryRunner.query(`ALTER TABLE "temporary_score_submission" RENAME TO "score_submission"`);
        await queryRunner.query(`CREATE TABLE "temporary_play_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timestamp" integer NOT NULL, "roomId" varchar, "synthMapId" integer, CONSTRAINT "FK_03d7095e96cfa5c4cfd7ec29fae" FOREIGN KEY ("synthMapId") REFERENCES "synth_map" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_play_instance"("id", "timestamp", "roomId", "synthMapId") SELECT "id", "timestamp", "roomId", "synthMapId" FROM "play_instance"`);
        await queryRunner.query(`DROP TABLE "play_instance"`);
        await queryRunner.query(`ALTER TABLE "temporary_play_instance" RENAME TO "play_instance"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "play_instance" RENAME TO "temporary_play_instance"`);
        await queryRunner.query(`CREATE TABLE "play_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timestamp" integer NOT NULL, "roomId" varchar, "synthMapId" integer)`);
        await queryRunner.query(`INSERT INTO "play_instance"("id", "timestamp", "roomId", "synthMapId") SELECT "id", "timestamp", "roomId", "synthMapId" FROM "temporary_play_instance"`);
        await queryRunner.query(`DROP TABLE "temporary_play_instance"`);
        await queryRunner.query(`ALTER TABLE "score_submission" RENAME TO "temporary_score_submission"`);
        await queryRunner.query(`CREATE TABLE "score_submission" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "submitter" varchar NOT NULL, "submittedOn" integer NOT NULL, "playInstanceId" integer)`);
        await queryRunner.query(`INSERT INTO "score_submission"("id", "submitter", "submittedOn", "playInstanceId") SELECT "id", "submitter", "submittedOn", "playInstanceId" FROM "temporary_score_submission"`);
        await queryRunner.query(`DROP TABLE "temporary_score_submission"`);
        await queryRunner.query(`ALTER TABLE "score" RENAME TO "temporary_score"`);
        await queryRunner.query(`CREATE TABLE "score" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "playerName" varchar NOT NULL, "score" integer NOT NULL, "totalNotesHit" integer NOT NULL, "perfectHits" integer NOT NULL, "goodHits" integer NOT NULL, "poorHits" integer NOT NULL, "longestStreak" integer NOT NULL, "maxMultiplier" integer NOT NULL, "specialsHit" integer NOT NULL, "scoreSubmissionId" integer)`);
        await queryRunner.query(`INSERT INTO "score"("id", "playerName", "score", "totalNotesHit", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId") SELECT "id", "playerName", "score", "totalNotesHit", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId" FROM "temporary_score"`);
        await queryRunner.query(`DROP TABLE "temporary_score"`);
        await queryRunner.query(`DROP TABLE "play_instance"`);
        await queryRunner.query(`DROP TABLE "score_submission"`);
        await queryRunner.query(`DROP TABLE "score"`);
        await queryRunner.query(`DROP TABLE "synth_map"`);
    }

}
