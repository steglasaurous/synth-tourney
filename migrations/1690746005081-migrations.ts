import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690746005081 implements MigrationInterface {
    name = 'Migration1690746005081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_score" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "playerName" varchar NOT NULL, "score" integer NOT NULL, "perfectHits" integer NOT NULL, "goodHits" integer NOT NULL, "poorHits" integer NOT NULL, "longestStreak" integer NOT NULL, "maxMultiplier" integer NOT NULL, "specialsHit" integer NOT NULL, "scoreSubmissionId" integer, CONSTRAINT "FK_279c9d40e7baf84b1e5fdacaa22" FOREIGN KEY ("scoreSubmissionId") REFERENCES "score_submission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_score"("id", "playerName", "score", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId") SELECT "id", "playerName", "score", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId" FROM "score"`);
        await queryRunner.query(`DROP TABLE "score"`);
        await queryRunner.query(`ALTER TABLE "temporary_score" RENAME TO "score"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "score" RENAME TO "temporary_score"`);
        await queryRunner.query(`CREATE TABLE "score" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "playerName" varchar NOT NULL, "score" integer NOT NULL, "totalNotesHit" integer NOT NULL, "perfectHits" integer NOT NULL, "goodHits" integer NOT NULL, "poorHits" integer NOT NULL, "longestStreak" integer NOT NULL, "maxMultiplier" integer NOT NULL, "specialsHit" integer NOT NULL, "scoreSubmissionId" integer, CONSTRAINT "FK_279c9d40e7baf84b1e5fdacaa22" FOREIGN KEY ("scoreSubmissionId") REFERENCES "score_submission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "score"("id", "playerName", "score", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId") SELECT "id", "playerName", "score", "perfectHits", "goodHits", "poorHits", "longestStreak", "maxMultiplier", "specialsHit", "scoreSubmissionId" FROM "temporary_score"`);
        await queryRunner.query(`DROP TABLE "temporary_score"`);
    }

}
