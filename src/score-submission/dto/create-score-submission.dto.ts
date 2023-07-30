export class CreateScoreDto {
    playerName: string;
    score: number;
    perfectHits: number;
    goodHits: number;
    poorHits: number;
    longestStreak: number;
    maxMultiplier: number;
    specialsHit: number;
}

export class CreateScoreSubmissionDto {
    submitterName: string;
    map: {
        title: string;
        artist: string;
        mapper: string;
        difficulty: string;
        totalNotes: number;
        totalSpecials: number;
    };
    scores: CreateScoreDto[] = [];
}
