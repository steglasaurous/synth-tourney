import { ScoreSubmittedEvent } from '../score-submitted.event';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';

export class GoogleSheetRhythmMastersListener {
  // FIXME: Move this into database at some point, once users and such get worked out.
  private spreadsheetId = '10xtMe3d4hrFrBNnSuy8pPRtuKjRoRF5cxSF2N9geDU8';
  private spreadsheetRawScoresTab = "'Raw'";
  private spreadsheetPlacementsTab = "'Week2'";
  private playerNameRange = 'A9:A20';
  private placementsRange = 'B9:B20';
  private logger: Logger = new Logger(GoogleSheetRhythmMastersListener.name);
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
    // FIXME: Handle submitting scores to spreadsheet only once per play instance.
    // Get list of player names in the playername column so we know what row a player's on.
    // Do we need to have a lookup in case the in-game player name doesn't match what's in the spreadsheet?
    const playerListResponse = await this.sheetsService.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      auth: this.googleAuth,
      range: this.spreadsheetPlacementsTab + '!' + this.playerNameRange,
      majorDimension: 'COLUMNS'
    });

    const playerList: any[] = playerListResponse.data.values;

    // Iterate through the scores and fill in the values at the appropriate locations
    // If a player name doesn't exist, add it.
    const scoresOutput = [];

    scoreSubmittedEvent.scores.forEach((score) => {
      let playerMatched = false;
      playerList[0].forEach((playerName, playerIndex) => {
        // Match players on all lowercase.
        if (playerName.toLowerCase() == score.playerName.toLowerCase()) {
          scoresOutput[playerIndex] = score.score;
          playerMatched = true;
        }
      });
      if (!playerMatched) {
        playerList[0].push(score.playerName);
        scoresOutput[playerList[0].length - 1] = score.score;
      }
    });

    const playerListUpdateResource = {
      playerList,
    };

    // Update playerList
    const updatePlayerListResult = await this.sheetsService.values.update({
      spreadsheetId: this.spreadsheetId,
      auth: this.googleAuth,
      range: this.spreadsheetPlacementsTab + '!' + this.playerNameRange,
      majorDimension: 'COLUMNS',
      valueInputOption: 'RAW',
      requestBody: playerListUpdateResource,
    });

    // Submit scores to next available set of columns.
    await this.appendScores(scoresOutput, `${this.spreadsheetPlacementsTab}!${this.placementsRange}`, 'COLUMNS');

    /*
    Players list should be:

    [
      [
        'player1',
        'player2',
      ]
    ]

    Scores should be lined up with player names.
    [
      [
        '1728131', // Player one's score
        '1238217', // Player two's score
      ]
    ]
     */


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

    sortedScores.forEach((score) => {
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
