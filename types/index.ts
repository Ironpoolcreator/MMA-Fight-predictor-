// Fighter Types
export interface Fighter {
  id: number;
  name: string;
  nickname: string | null;
  division: string;
  record: string;
  wins: number;
  losses: number;
  draws: number;
  noContests?: number | null;
  age?: number | null;
  height?: string | null;
  reach?: string | null;
  weight?: string | null;
  stance?: string | null;
  image?: string | null;
  isChampion?: boolean;
  ranking?: number | null;
  knockoutPower?: number;
  strikingAccuracy?: string | null;
  takedownDefense?: string | null;
  submission?: number;
  cardio?: number;
  chin?: number;
  style?: string | null;
  strengths?: string | null;
  weaknesses?: string | null;
  location?: string | null;
  winsByKO?: number;
  winsBySub?: number;
  winsByDec?: number;
  
  // UFC-style additional properties
  country?: string | null;
  countryCode?: string | null;
  odds?: number;
  rank?: number;
  strikesLandedPerMin?: string | null;
  takedownsLandedPerMatch?: string | null;
  takedownAccuracy?: string | null;
  submissionAttempts?: string | null;
  averageFightTime?: string | null;
  lastFightDate?: string | null;
  knockoutWins?: string | null;
  submissionWins?: string | null;
  decisionWins?: string | null;
}

// Comparison Types
export interface ComparisonStat {
  label: string;
  key1: string;
  key2: string;
  value1: string;
  value2: string;
  percent1: number;
  percent2: number;
}

export interface FighterComparison {
  id: number;
  fighter1Id: number;
  fighter2Id: number;
  title: string;
  notes: string | null;
  userId: number | null;
  isPublic: boolean;
  createdAt: string;
}

// Fight Prediction Types
export interface FightPrediction {
  fighter1: Fighter;
  fighter2: Fighter;
  fighter1WinProbability: number;
  fighter2WinProbability: number;
  analysis: string;
  confidenceScore: number;
  likelyOutcome?: {
    winner: string;
    method: string;
    round?: number;
  };
  technicalBreakdown?: string;
  gameplanAnalysis?: {
    fighter1Strategy?: string;
    fighter2Strategy?: string;
  };
  keyStats?: string[];
}

// Featured Fight Types
export interface FeaturedFight {
  fighter1: Fighter;
  fighter2: Fighter;
  eventName: string;
  eventDate: string;
  venue: string;
  weightClass: string;
  isTitleFight: boolean;
  isMainEvent: boolean;
  predictions?: {
    odds: {
      fighter1: number;
      fighter2: number;
    };
    expertPicks: {
      fighter1Count: number;
      fighter2Count: number;
    };
  };
}

// Fight Stats Types
export interface FightStats {
  id: number;
  fighterId: number;
  strikesLandedPerMin: number;
  strikesAbsorbedPerMin: number;
  strikingAccuracy: number;
  strikingDefense: number;
  knockdownAvg: number;
  takedownsLandedPerMin: number;
  takedownAccuracy: number;
  takedownDefense: number;
  submissionAttemptsPerMin: number;
}

// Fight History Types
export interface FightHistory {
  id: number;
  fighterId: number;
  opponent: string;
  result: string;
  method: string;
  round: number;
  time: string;
  date: string;
  event: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  createdAt: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}