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
  private placementsRange = 'B9:W20';
  private logger: Logger = new Logger(GoogleSheetRhythmMastersListener.name);
  private googleAuth;
  private sheetsService;

  private submittedPlayInstances: number[] = [];
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
    // Check the play instance cache.  If we've already written to the spreadsheet for this instance, don't do anything.
    if (
      this.submittedPlayInstances.includes(scoreSubmittedEvent.playInstance.id)
    ) {
      this.logger.log('Already submitted for play instance', {
        playInstanceId: scoreSubmittedEvent.playInstance.id,
        synthMap: scoreSubmittedEvent.synthMap.title,
      });
      return;
    }

    // Update right away so if another submitter submits scores, we can catch it and not double up.
    this.submittedPlayInstances.push(scoreSubmittedEvent.playInstance.id);

    this.logger.log('Submitting scores', {
      playInstanceId: scoreSubmittedEvent.playInstance.id,
      synthMap: scoreSubmittedEvent.synthMap.title,
    });

    // Get list of player names in the playername column so we know what row a player's on.
    // Do we need to have a lookup in case the in-game player name doesn't match what's in the spreadsheet?
    const playerListResponse = await this.sheetsService.spreadsheets.values.get(
      {
        spreadsheetId: this.spreadsheetId,
        auth: this.googleAuth,
        range: this.spreadsheetPlacementsTab + '!' + this.playerNameRange,
        majorDimension: 'COLUMNS',
      },
    );

    const playerList: any[] = playerListResponse.data.values;
    this.logger.debug('Current playerlist', { playerList: playerList });

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

    // Clean the array so we put empty strings for any non-existent scores.
    for (let i = 0; i < scoresOutput.length; i++) {
      if (!scoresOutput[i]) {
        scoresOutput[i] = '';
      }
    }
    this.logger.debug('Updated player list', { playerList: playerList });

    const playerListUpdateResource = {
      values: playerList,
      majorDimension: 'COLUMNS',
    };
    // Update playerList
    const updatePlayerListResult =
      await this.sheetsService.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        auth: this.googleAuth,
        range: `${this.spreadsheetPlacementsTab}!${this.playerNameRange}`,
        valueInputOption: 'RAW',
        requestBody: playerListUpdateResource,
      });
    this.logger.debug('Player list written to sheet');

    // Submit scores to next available set of columns.
    const targetRange = await this.getNextAvailableRange(
      `${this.spreadsheetPlacementsTab}!${this.placementsRange}`,
    );
    this.logger.debug('Appending scores', {
      scores: scoresOutput,
      targetRange: targetRange,
    });
    await this.appendScores([scoresOutput], targetRange, 'COLUMNS');

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
        scoreSubmittedEvent.synthMap.title,
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
    this.logger.debug('Appending raw score data', { rawData: rawData });
    await this.appendScores(rawData, this.spreadsheetRawScoresTab);

    this.logger.log('Spreadsheet update complete');
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

  private async getNextAvailableRange(range) {
    const currentContent = await this.sheetsService.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      auth: this.googleAuth,
      range: range,
      majorDimension: 'COLUMNS',
    });
    const startColumn: number = range.split('!')[1].split(':')[0].charCodeAt(0);
    const startRow: number = range.split('!')[1].split(':')[0][1];

    let targetColumnName: string;
    if (!currentContent.data.values) {
      console.log('No data in current content');
      targetColumnName = String.fromCharCode(startColumn);
    } else if (startColumn + currentContent.data.values.length > 90) {
      targetColumnName = String.fromCharCode(
        startColumn + currentContent.data.values.length - 64,
      );
    } else {
      targetColumnName = String.fromCharCode(
        startColumn + currentContent.data.values.length,
      );
    }

    return `${this.spreadsheetPlacementsTab}!${targetColumnName}${startRow}`;
  }
}
