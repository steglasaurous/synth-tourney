import { ScoreSubmittedEvent } from '../score-submitted.event';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';

export class GoogleSheetUpdaterListener {
  // FIXME: Move this into database at some point, once users and such get worked out.
  private spreadsheetId = '1W6P0TsH96SaqpFLWlHu9x466rQeL6TojnjJwOlx24cY';
  private spreadsheetRawScoresTab = "'Example 1 - Raw Score Results'";
  private spreadsheetPlacementsTab = "'Template'";
  private logger: Logger = new Logger(GoogleSheetUpdaterListener.name);
  private googleAuth;
  private sheetsService;

  constructor() {
    const creds = JSON.parse(fs.readFileSync('credentials.json').toString());

    this.googleAuth = new google.auth.JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheetsService = google.sheets('v4');
  }
  @OnEvent(ScoreSubmittedEvent.name)
  async handle(scoreSubmittedEvent: ScoreSubmittedEvent) {
    // Do raw scores
    const sortedScores = scoreSubmittedEvent.scores.sort((a, b) => {
      if (a.score > b.score) {
        return 1;
      } else if (a.score < b.score) {
        return -1;
      } else {
        return 0;
      }
    });

    const rawData = [];
    const placements = [];

    sortedScores.forEach((score) => {
      placements.push(score.playerName);
      rawData.push([
        score.playerName,
        score.score,
        score.perfectHits,
        score.goodHits,
        score.poorHits,
        score.maxMultiplier,
        score.longestStreak,
        score.specialsHit,
      ]);
    });

    await this.appendScores(
      [placements],
      this.spreadsheetPlacementsTab + '!C3:C16',
      'COLUMNS',
    );

    await this.appendScores(rawData, this.spreadsheetRawScoresTab);
  }

  private async appendScores(values, range, majorDimension = 'ROWS') {
    const resource = {
      values,
      majorDimension: majorDimension,
    };

    // Fix error where it can't figure out the range definition.
    try {
      const result = await this.sheetsService.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        auth: this.googleAuth,
        range: range,
        valueInputOption: 'RAW',
        requestBody: resource,
      });
    } catch (err) {
      throw err;
    }
  }
}
