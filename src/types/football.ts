
export interface Team {
  id: number;
  name: string;
  shortName: string;
  logoUrl?: string;
}

export interface Match {
  id: number;
  round: number;
  homeTeamId: number;
  awayTeamId: number;
  homeGoals: number | null;
  awayGoals: number | null;
  played: boolean;
}

export interface TeamStats {
  teamId: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  position?: number;
}

export interface KnockoutMatch {
  id: number;
  stage: 'QUARTER' | 'SEMI' | 'FINAL';
  matchNumber: number; // 1-4 for quarters, 1-2 for semis, 1 for final
  legNumber: 1 | 2; // First or second leg
  homeTeamId: number | null;
  awayTeamId: number | null;
  homeGoals: number | null;
  awayGoals: number | null;
  played: boolean;
}

export interface KnockoutMatchPair {
  id: number;
  stage: 'QUARTER' | 'SEMI' | 'FINAL';
  matchNumber: number;
  firstLeg: KnockoutMatch;
  secondLeg: KnockoutMatch;
  homeTeamId: number | null;
  awayTeamId: number | null;
  homeAggregateGoals: number;
  awayAggregateGoals: number;
  winnerId: number | null;
}
