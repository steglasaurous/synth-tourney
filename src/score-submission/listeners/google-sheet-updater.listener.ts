import { ScoreSubmittedEvent } from '../score-submitted.event';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';

export class GoogleSheetUpdaterListener {
  // FIXME: Move this into database at some point, once users and such get worked out.
  private spreadsheetId = '1pCTNCszDH0XleIwhXriRO97edPbsM4SqoemhSeZjoQc';
  private spreadsheetRawScoresTab = "'Example 1 - Raw Score Results'";
  private spreadsheetPlacementsTab = 'Template';
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

    // Find out who got highest accuracy
    // FIXME: Change to allow multiple winners of highest accuracy (up to 3)
    let highestAccuracyPlayerName;
    let highestAccuracyScore = 0;
    sortedScores.forEach((score) => {
      if (score.perfectHits > highestAccuracyScore) {
        highestAccuracyPlayerName = score.playerName;
        highestAccuracyScore = score.perfectHits;
      }
    });

    const rawData = [];
    const placements = [];
    let winnerPushed = false;
    sortedScores.forEach((score) => {
      placements.push(score.playerName);
      rawData.push([
        scoreSubmittedEvent.synthMap.title,
        score.playerName,
        score.score,
        score.perfectHits,
        score.goodHits,
        score.poorHits,
        score.maxMultiplier,
        score.longestStreak,
        score.specialsHit,
        score.playerName == highestAccuracyPlayerName,
        winnerPushed == false,
      ]);
      winnerPushed = true;
    });

    // Find out the next value available in the spreadsheet.
    const currentContent = await this.sheetsService.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      auth: this.googleAuth,
      range: this.spreadsheetPlacementsTab + '!C3:AF3',
    });
    // C == 67
    // String.fromCharCode(67)
    let targetColumnName;
    if (!currentContent.data.values) {
      // No data, start at 'C';
      targetColumnName = 'C';
    } else if (currentContent.data.values[0].length > 24) {
      targetColumnName = String.fromCharCode(
        65 + currentContent.data.values[0].length - 24,
      );
    } else {
      targetColumnName = String.fromCharCode(
        67 + currentContent.data.values[0].length,
      );
    }

    const targetRange = `${this.spreadsheetPlacementsTab}!${targetColumnName}3`;

    await this.appendScores([placements], targetRange, 'COLUMNS');
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
