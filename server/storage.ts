import { 
  Fighter, 
  InsertFighter, 
  FightHistory, 
  InsertFightHistory, 
  FightStats, 
  InsertFightStats,
  FighterComparison,
  InsertFighterComparison,
  PredictionHistory,
  InsertPredictionHistory
} from "@shared/schema";

import { User, InsertUser } from "@shared/auth-schema";

// Define interface for comparison stats used in UI
export interface ComparisonStat {
  label: string;
  key1: string;
  key2: string;
  value1: string;
  value2: string;
  percent1: number;
  percent2: number;
}

// Define sample fighter data for development
const fightersData: Fighter[] = [
  {
    id: 101,
    name: "IAN MACHADO GARRY",
    nickname: "The Future",
    division: "WELTERWEIGHT",
    record: "13-0-0",
    wins: 13,
    losses: 0,
    draws: 0,
    noContests: 0,
    age: 26,
    height: "6'3\"",
    weight: "170 lbs",
    reach: "75\"",
    strikesLandedPerMin: "4.82",
    strikingAccuracy: 54,
    takedownAccuracy: 45,
    takedownDefense: 76,
    birthplace: "Dublin, Ireland",
    fightingStyle: "Striking",
    weightClass: "Welterweight",
    team: "Kill Cliff FC",
    ranking: 7,
    image: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-12/GARRY_IAN_L.png?itok=m3QH_1EB",
    country: "Ireland",
    countryCode: "ie"
  },
  {
    id: 102,
    name: "VICENTE LUQUE",
    nickname: "The Silent Assassin",
    division: "WELTERWEIGHT",
    record: "22-9-1",
    wins: 22,
    losses: 9,
    draws: 1,
    noContests: 0,
    age: 32,
    height: "5'11\"",
    weight: "170 lbs",
    reach: "75.5\"",
    strikesLandedPerMin: "5.45",
    strikingAccuracy: 53,
    takedownAccuracy: 32,
    takedownDefense: 63,
    birthplace: "Westwood, New Jersey",
    fightingStyle: "Muay Thai, BJJ",
    weightClass: "Welterweight",
    team: "Cerrado MMA",
    ranking: 10,
    image: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/LUQUE_VICENTE_L_08-12.png?itok=kTMT22Bj",
    country: "Brazil",
    countryCode: "br"
  },
  {
    id: 103,
    name: "DUSTIN POIRIER",
    nickname: "The Diamond",
    division: "LIGHTWEIGHT",
    record: "29-8-0",
    wins: 29,
    losses: 8,
    draws: 0,
    noContests: 0,
    age: 35,
    height: "5'9\"",
    weight: "155 lbs",
    reach: "72\"",
    strikesLandedPerMin: "5.62",
    strikingAccuracy: 50,
    takedownAccuracy: 35,
    takedownDefense: 69,
    birthplace: "Lafayette, Louisiana",
    fightingStyle: "Boxing, BJJ",
    weightClass: "Lightweight",
    team: "American Top Team",
    ranking: 3,
    image: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/POIRIER_DUSTIN_L_07-29.png?itok=LhvV0xFr",
    country: "USA",
    countryCode: "us"
  },
  {
    id: 104,
    name: "CHARLES OLIVEIRA",
    nickname: "Do Bronx",
    division: "LIGHTWEIGHT",
    record: "34-10-0",
    wins: 34,
    losses: 10,
    draws: 0,
    noContests: 0,
    age: 34,
    height: "5'10\"",
    weight: "155 lbs",
    reach: "74\"",
    strikesLandedPerMin: "3.55",
    strikingAccuracy: 53,
    takedownAccuracy: 41,
    takedownDefense: 57,
    birthplace: "Guarujá, Brazil",
    fightingStyle: "BJJ",
    weightClass: "Lightweight",
    team: "Chute Boxe Diego Lima",
    ranking: 2,
    image: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-05/OLIVEIRA_CHARLES_L_05-06.png?itok=Ip75Sj82",
    country: "Brazil",
    countryCode: "br"
  },
  {
    id: 105,
    name: "SEAN O'MALLEY",
    nickname: "Sugar",
    division: "BANTAMWEIGHT",
    record: "18-1-0",
    wins: 18,
    losses: 1,
    draws: 0,
    noContests: 0,
    age: 29,
    height: "5'11\"",
    weight: "135 lbs",
    reach: "72\"",
    strikesLandedPerMin: "6.08",
    strikingAccuracy: 62,
    takedownAccuracy: 50,
    takedownDefense: 73,
    birthplace: "Helena, Montana",
    fightingStyle: "Striking",
    weightClass: "Bantamweight",
    team: "MMA Lab",
    ranking: 0,
    image: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/OMALLEY_SEAN_L_08-19.png?itok=LTrxpKLm",
    country: "USA",
    countryCode: "us"
  }
];

export interface IStorage {
  // Fighter operations
  getAllFighters(): Promise<Fighter[]>;
  getFighterById(id: number): Promise<Fighter | undefined>;
  createFighter(fighter: InsertFighter): Promise<Fighter>;
  
  // Fight stats operations
  getFighterStatsById(fighterId: number): Promise<FightStats | undefined>;
  createFighterStats(stats: InsertFightStats): Promise<FightStats>;
  
  // Fight history operations
  getFighterHistoryById(fighterId: number): Promise<FightHistory[]>;
  createFightHistory(history: InsertFightHistory): Promise<FightHistory>;
  
  // Featured fight
  getFeaturedFight(): Promise<any>;
  
  // Fighter comparison operations
  getAllFighterComparisons(): Promise<FighterComparison[]>;
  getFighterComparisonById(id: number): Promise<FighterComparison | undefined>;
  getFighterComparisonsByUserId(userId: number): Promise<FighterComparison[]>;
  createFighterComparison(comparison: InsertFighterComparison): Promise<FighterComparison>;
  updateFighterComparison(id: number, comparisonData: Partial<FighterComparison>): Promise<FighterComparison | undefined>;
  deleteFighterComparison(id: number): Promise<boolean>;
  
  // Prediction history operations
  getAllPredictionHistory(): Promise<PredictionHistory[]>;
  getPredictionHistoryById(id: number): Promise<PredictionHistory | undefined>;
  getPredictionHistoryByUserId(userId: number): Promise<PredictionHistory[]>;
  getPredictionHistoryByFighters(fighter1Id: number, fighter2Id: number): Promise<PredictionHistory[]>;
  createPredictionHistory(prediction: InsertPredictionHistory): Promise<PredictionHistory>;
  updatePredictionHistory(id: number, predictionData: Partial<PredictionHistory>): Promise<PredictionHistory | undefined>;
  deletePredictionHistory(id: number): Promise<boolean>;
  
  // User authentication
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
}

/**
 * Memory storage implementation for development and testing
 */
export class MemStorage implements IStorage {
  private fighters: Map<number, Fighter>;
  private fightStats: Map<number, FightStats>;
  private fightHistories: Map<number, FightHistory[]>;
  private fighterComparisons: Map<number, FighterComparison>;
  private fighterComparisonsByUser: Map<number, FighterComparison[]>;
  private predictionHistory: Map<number, PredictionHistory>;
  private predictionHistoryByUser: Map<number, PredictionHistory[]>;
  private predictionHistoryByFighters: Map<string, PredictionHistory[]>;
  private users: Map<number, User>;
  private usersByUsername: Map<string, User>;
  private usersByEmail: Map<string, User>;
  private currentFighterId: number;
  private currentStatsId: number;
  private currentHistoryId: number;
  private currentComparisonId: number;
  private currentUserId: number;
  private currentPredictionId: number;

  constructor() {
    this.fighters = new Map();
    this.fightStats = new Map();
    this.fightHistories = new Map();
    this.fighterComparisons = new Map();
    this.fighterComparisonsByUser = new Map();
    this.predictionHistory = new Map();
    this.predictionHistoryByUser = new Map();
    this.predictionHistoryByFighters = new Map();
    this.users = new Map();
    this.usersByUsername = new Map();
    this.usersByEmail = new Map();
    
    // Initialize with some data
    this.currentFighterId = 1;
    this.currentStatsId = 1;
    this.currentHistoryId = 1;
    this.currentComparisonId = 1;
    this.currentUserId = 1;
    this.currentPredictionId = 1;
    
    // Seed data from fighters data
    this.seedFightersData();
  }

  private seedFightersData() {
    // Seed fighters
    fightersData.forEach(fighter => {
      this.fighters.set(fighter.id, fighter);
      this.currentFighterId = Math.max(this.currentFighterId, fighter.id + 1);
      
      // Generate stats for each fighter
      const stats: FightStats = {
        id: this.currentStatsId++,
        fighterId: fighter.id,
        strikesLanded: Math.floor(Math.random() * 1000) + 500,
        strikingAccuracy: fighter.strikingAccuracy || null,
        strikesLandedPerMin: fighter.strikesLandedPerMin || null,
        strikesAbsorbedPerMin: (Math.random() * 3 + 1).toFixed(1),
        strikingDefense: Math.floor(Math.random() * 25) + 50,
        takedownAvgPer15Min: (Math.random() * 2).toFixed(1),
        takedownAccuracy: fighter.takedownAccuracy || null,
        takedownDefense: fighter.takedownDefense || null,
        submissionAvgPer15Min: (Math.random() * 1.5).toFixed(1),
        submissionAttempts: Math.floor(Math.random() * 15) + 1,
        reversalRate: Math.floor(Math.random() * 20) + 5,
        controlTimePercentage: Math.floor(Math.random() * 30) + 10,
        controlTimeAvg: `${Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
        knockdownRate: (Math.random() * 1).toFixed(2),
        knockoutPercentage: Math.floor(Math.random() * 50) + 10,
        submissionPercentage: Math.floor(Math.random() * 40) + 5,
        decisionPercentage: Math.floor(Math.random() * 50) + 20,
        significantStrikePercentage: Math.floor(Math.random() * 30) + 40,
        averageFightTime: `${Math.floor(Math.random() * 10) + 5}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`
      };
      
      this.fightStats.set(fighter.id, stats);
      
      // Generate fight history for each fighter
      const opponents = [
        "Ciryl Gane", "Stipe Miocic", "Dominick Reyes", 
        "Thiago Santos", "Anthony Smith", "Alexander Gustafsson",
        "Daniel Cormier", "Glover Teixeira", "Volkan Oezdemir"
      ];
      
      const methods = [
        "KO/TKO", "SUB", "DEC", "DEC", "SUB", "KO/TKO"
      ];
      
      const events = [
        "UFC 320", "UFC 319", "UFC 318", "UFC 317",
        "UFC 316", "UFC 315", "UFC 314", "UFC 313", "UFC 312"
      ];
      
      const results = ["win", "win", "win", "win", "loss", "win", "win", "draw", "win"];
      
      const history: FightHistory[] = Array.from({ length: 6 }, (_, i) => ({
        id: this.currentHistoryId++,
        fighterId: fighter.id,
        opponent: opponents[Math.floor(Math.random() * opponents.length)],
        result: results[Math.floor(Math.random() * results.length)],
        method: methods[Math.floor(Math.random() * methods.length)],
        round: Math.floor(Math.random() * 5) + 1,
        time: `${Math.floor(Math.random() * 4) + 1}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
        event: events[Math.floor(Math.random() * events.length)],
        date: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Math.floor(Math.random() * 12)]} ${Math.floor(Math.random() * 28) + 1}, ${Math.floor(Math.random() * 2) + 2024}`
      }));
      
      this.fightHistories.set(fighter.id, history);
    });
  }

  async getAllFighters(): Promise<Fighter[]> {
    return Array.from(this.fighters.values());
  }

  async getFighterById(id: number): Promise<Fighter | undefined> {
    return this.fighters.get(id);
  }

  async createFighter(insertFighter: InsertFighter): Promise<Fighter> {
    const id = this.currentFighterId++;
    // Ensure all required fields are present
    const fighter: Fighter = { 
      ...insertFighter, 
      id,
      // Set defaults for any missing fields
      nickname: insertFighter.nickname || null,
      age: insertFighter.age || null,
      height: insertFighter.height || null,
      weight: insertFighter.weight || null,
      reach: insertFighter.reach || null,
      birthplace: insertFighter.birthplace || null,
      fightingStyle: insertFighter.fightingStyle || null,
      weightClass: insertFighter.weightClass || null,
      team: insertFighter.team || null,
      noContests: insertFighter.noContests || null,
      strikesLandedPerMin: insertFighter.strikesLandedPerMin || null,
      strikingAccuracy: insertFighter.strikingAccuracy || null,
      takedownAccuracy: insertFighter.takedownAccuracy || null,
      takedownDefense: insertFighter.takedownDefense || null,
      ranking: insertFighter.ranking || null
    };
    this.fighters.set(id, fighter);
    return fighter;
  }

  async getFighterStatsById(fighterId: number): Promise<FightStats | undefined> {
    return this.fightStats.get(fighterId);
  }

  async createFighterStats(insertStats: InsertFightStats): Promise<FightStats> {
    const id = this.currentStatsId++;
    // Ensure all required fields have defaults if not provided
    const stats: FightStats = { 
      ...insertStats, 
      id,
      strikingAccuracy: insertStats.strikingAccuracy !== undefined ? insertStats.strikingAccuracy : null,
      strikesLandedPerMin: insertStats.strikesLandedPerMin !== undefined ? insertStats.strikesLandedPerMin : null,
      strikesLanded: insertStats.strikesLanded !== undefined ? insertStats.strikesLanded : null,
      strikesAbsorbedPerMin: insertStats.strikesAbsorbedPerMin !== undefined ? insertStats.strikesAbsorbedPerMin : null,
      strikingDefense: insertStats.strikingDefense !== undefined ? insertStats.strikingDefense : null,
      takedownAvgPer15Min: insertStats.takedownAvgPer15Min !== undefined ? insertStats.takedownAvgPer15Min : null,
      takedownAccuracy: insertStats.takedownAccuracy !== undefined ? insertStats.takedownAccuracy : null,
      takedownDefense: insertStats.takedownDefense !== undefined ? insertStats.takedownDefense : null,
      submissionAvgPer15Min: insertStats.submissionAvgPer15Min !== undefined ? insertStats.submissionAvgPer15Min : null,
      submissionAttempts: insertStats.submissionAttempts !== undefined ? insertStats.submissionAttempts : null,
      reversalRate: insertStats.reversalRate !== undefined ? insertStats.reversalRate : null,
      controlTimePercentage: insertStats.controlTimePercentage !== undefined ? insertStats.controlTimePercentage : null,
      controlTimeAvg: insertStats.controlTimeAvg !== undefined ? insertStats.controlTimeAvg : null,
      knockdownRate: insertStats.knockdownRate !== undefined ? insertStats.knockdownRate : null,
      knockoutPercentage: insertStats.knockoutPercentage !== undefined ? insertStats.knockoutPercentage : null,
      submissionPercentage: insertStats.submissionPercentage !== undefined ? insertStats.submissionPercentage : null,
      decisionPercentage: insertStats.decisionPercentage !== undefined ? insertStats.decisionPercentage : null,
      significantStrikePercentage: insertStats.significantStrikePercentage !== undefined ? insertStats.significantStrikePercentage : null,
      averageFightTime: insertStats.averageFightTime !== undefined ? insertStats.averageFightTime : null
    };
    this.fightStats.set(insertStats.fighterId, stats);
    return stats;
  }

  async getFighterHistoryById(fighterId: number): Promise<FightHistory[]> {
    return this.fightHistories.get(fighterId) || [];
  }

  async createFightHistory(insertHistory: InsertFightHistory): Promise<FightHistory> {
    const id = this.currentHistoryId++;
    const history: FightHistory = { 
      ...insertHistory, 
      id,
      date: insertHistory.date || null,
      round: insertHistory.round || null,
      time: insertHistory.time || null,
      event: insertHistory.event || null
    };
    
    const existingHistory = this.fightHistories.get(insertHistory.fighterId) || [];
    existingHistory.push(history);
    this.fightHistories.set(insertHistory.fighterId, existingHistory);
    
    return history;
  }

  async getFeaturedFight(): Promise<any> {
    // Get featured fighters (or any two fighters)
    const allFighters = Array.from(this.fighters.values());
    const fighter1 = allFighters[0];
    const fighter2 = allFighters[1];
    
    if (!fighter1 || !fighter2) {
      throw new Error("Failed to find featured fighters");
    }
    
    // Generate comparison stats
    const comparisonStats: ComparisonStat[] = [
      {
        label: "Striking",
        key1: "strikingAccuracy",
        key2: "strikingAccuracy",
        value1: "68%",
        value2: "62%",
        percent1: 68,
        percent2: 62
      },
      {
        label: "TDD",
        key1: "takedownDefense",
        key2: "takedownDefense",
        value1: "94%",
        value2: "85%",
        percent1: 94,
        percent2: 85
      },
      {
        label: "Sub Def",
        key1: "submissionDefense",
        key2: "submissionDefense",
        value1: "100%",
        value2: "92%",
        percent1: 100,
        percent2: 92
      },
      {
        label: "KO Power",
        key1: "knockoutPower",
        key2: "knockoutPower",
        value1: "87%",
        value2: "91%",
        percent1: 87,
        percent2: 91
      }
    ];
    
    return {
      fighter1,
      fighter2,
      fighter1WinProbability: 65,
      fighter2WinProbability: 35,
      eventName: "UFC 321",
      eventDate: "April 27, 2025",
      confidenceScore: 87,
      comparisonStats,
      analysis: "Based on our analysis, Jones has a significant advantage in the grappling department with superior wrestling credentials and control time. Miocic's best chance is to keep the fight standing and utilize his boxing. Jones' reach advantage and creative striking will likely be the difference maker if the fight stays on the feet.",
      likelyVictoryMethod: {
        method: "Jones by Submission",
        probability: 42
      },
      fightDuration: {
        duration: "4+ Rounds",
        probability: 68
      },
      fightPace: {
        pace: "Moderate",
        probability: 74
      }
    };
  }

  // Fighter comparison methods
  async getAllFighterComparisons(): Promise<FighterComparison[]> {
    return Array.from(this.fighterComparisons.values());
  }

  async getFighterComparisonById(id: number): Promise<FighterComparison | undefined> {
    return this.fighterComparisons.get(id);
  }

  async getFighterComparisonsByUserId(userId: number): Promise<FighterComparison[]> {
    return this.fighterComparisonsByUser.get(userId) || [];
  }

  async createFighterComparison(comparison: InsertFighterComparison): Promise<FighterComparison> {
    const id = this.currentComparisonId++;
    const createdAt = new Date();
    // Ensure all required fields have defaults
    const newComparison: FighterComparison = { 
      ...comparison, 
      id, 
      createdAt,
      userId: comparison.userId !== undefined ? comparison.userId : null,
      notes: comparison.notes !== undefined ? comparison.notes : null,
      predictionSummary: comparison.predictionSummary !== undefined ? comparison.predictionSummary : null,
      predictionScore: comparison.predictionScore !== undefined ? comparison.predictionScore : null,
      isPublic: comparison.isPublic !== undefined ? comparison.isPublic : null
    };
    
    // Store the comparison
    this.fighterComparisons.set(id, newComparison);
    
    // Add to user's comparisons if userId is provided
    if (comparison.userId !== null && comparison.userId !== undefined) {
      const userComparisons = this.fighterComparisonsByUser.get(comparison.userId) || [];
      userComparisons.push(newComparison);
      this.fighterComparisonsByUser.set(comparison.userId, userComparisons);
    }
    
    return newComparison;
  }

  async updateFighterComparison(id: number, comparisonData: Partial<FighterComparison>): Promise<FighterComparison | undefined> {
    const existingComparison = this.fighterComparisons.get(id);
    
    if (!existingComparison) {
      return undefined;
    }
    
    // Update the comparison
    const updatedComparison = { ...existingComparison, ...comparisonData };
    this.fighterComparisons.set(id, updatedComparison);
    
    // Update user's comparisons if userId exists
    if (existingComparison.userId !== null) {
      const userComparisons = this.fighterComparisonsByUser.get(existingComparison.userId) || [];
      const updatedUserComparisons = userComparisons.map(comp => 
        comp.id === id ? updatedComparison : comp
      );
      this.fighterComparisonsByUser.set(existingComparison.userId, updatedUserComparisons);
    }
    
    return updatedComparison;
  }

  async deleteFighterComparison(id: number): Promise<boolean> {
    const comparison = this.fighterComparisons.get(id);
    
    if (!comparison) {
      return false;
    }
    
    this.fighterComparisons.delete(id);
    
    if (comparison.userId !== null) {
      const userComparisons = this.fighterComparisonsByUser.get(comparison.userId) || [];
      const updatedUserComparisons = userComparisons.filter(comp => comp.id !== id);
      this.fighterComparisonsByUser.set(comparison.userId, updatedUserComparisons);
    }
    
    return true;
  }

  // Prediction history methods
  async getAllPredictionHistory(): Promise<PredictionHistory[]> {
    return Array.from(this.predictionHistory.values());
  }

  async getPredictionHistoryById(id: number): Promise<PredictionHistory | undefined> {
    return this.predictionHistory.get(id);
  }

  async getPredictionHistoryByUserId(userId: number): Promise<PredictionHistory[]> {
    return this.predictionHistoryByUser.get(userId) || [];
  }

  async getPredictionHistoryByFighters(fighter1Id: number, fighter2Id: number): Promise<PredictionHistory[]> {
    const key = `${fighter1Id}-${fighter2Id}`;
    return this.predictionHistoryByFighters.get(key) || 
           this.predictionHistoryByFighters.get(`${fighter2Id}-${fighter1Id}`) || 
           [];
  }

  async createPredictionHistory(prediction: InsertPredictionHistory): Promise<PredictionHistory> {
    const id = this.currentPredictionId++;
    const createdAt = new Date();
    
    // Create prediction with defaults for optional fields
    const newPrediction: PredictionHistory = {
      ...prediction,
      id,
      createdAt,
      userId: prediction.userId !== undefined ? prediction.userId : null,
      confidenceScore: prediction.confidenceScore !== undefined ? prediction.confidenceScore : null,
      analysis: prediction.analysis !== undefined ? prediction.analysis : null,
      predictionMethod: prediction.predictionMethod !== undefined ? prediction.predictionMethod : null,
      predictionRound: prediction.predictionRound !== undefined ? prediction.predictionRound : null,
      isPublic: prediction.isPublic !== undefined ? prediction.isPublic : true
    };
    
    // Store in all relevant maps
    this.predictionHistory.set(id, newPrediction);
    
    if (prediction.userId !== null && prediction.userId !== undefined) {
      const userPredictions = this.predictionHistoryByUser.get(prediction.userId) || [];
      userPredictions.push(newPrediction);
      this.predictionHistoryByUser.set(prediction.userId, userPredictions);
    }
    
    const fighterKey = `${prediction.fighter1Id}-${prediction.fighter2Id}`;
    const fighterPredictions = this.predictionHistoryByFighters.get(fighterKey) || [];
    fighterPredictions.push(newPrediction);
    this.predictionHistoryByFighters.set(fighterKey, fighterPredictions);
    
    return newPrediction;
  }

  async updatePredictionHistory(id: number, predictionData: Partial<PredictionHistory>): Promise<PredictionHistory | undefined> {
    const existingPrediction = this.predictionHistory.get(id);
    
    if (!existingPrediction) {
      return undefined;
    }
    
    // Update the prediction
    const updatedPrediction = { ...existingPrediction, ...predictionData };
    this.predictionHistory.set(id, updatedPrediction);
    
    // Update in user predictions if userId exists
    if (existingPrediction.userId !== null) {
      const userPredictions = this.predictionHistoryByUser.get(existingPrediction.userId) || [];
      const updatedUserPredictions = userPredictions.map(pred => 
        pred.id === id ? updatedPrediction : pred
      );
      this.predictionHistoryByUser.set(existingPrediction.userId, updatedUserPredictions);
    }
    
    // Update in fighter predictions
    const fighterKey = `${existingPrediction.fighter1Id}-${existingPrediction.fighter2Id}`;
    const fighterPredictions = this.predictionHistoryByFighters.get(fighterKey) || [];
    const updatedFighterPredictions = fighterPredictions.map(pred => 
      pred.id === id ? updatedPrediction : pred
    );
    this.predictionHistoryByFighters.set(fighterKey, updatedFighterPredictions);
    
    return updatedPrediction;
  }

  async deletePredictionHistory(id: number): Promise<boolean> {
    const prediction = this.predictionHistory.get(id);
    
    if (!prediction) {
      return false;
    }
    
    this.predictionHistory.delete(id);
    
    if (prediction.userId !== null) {
      const userPredictions = this.predictionHistoryByUser.get(prediction.userId) || [];
      const updatedUserPredictions = userPredictions.filter(pred => pred.id !== id);
      this.predictionHistoryByUser.set(prediction.userId, updatedUserPredictions);
    }
    
    const fighterKey = `${prediction.fighter1Id}-${prediction.fighter2Id}`;
    const fighterPredictions = this.predictionHistoryByFighters.get(fighterKey) || [];
    const updatedFighterPredictions = fighterPredictions.filter(pred => pred.id !== id);
    this.predictionHistoryByFighters.set(fighterKey, updatedFighterPredictions);
    
    return true;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.usersByUsername.get(username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.usersByEmail.get(email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    
    const user: User = {
      ...insertUser,
      id,
      createdAt,
      fullName: insertUser.fullName !== undefined ? insertUser.fullName : null
    };
    
    this.users.set(id, user);
    this.usersByUsername.set(user.username, user);
    this.usersByEmail.set(user.email, user);
    
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    
    if (!existingUser) {
      return undefined;
    }
    
    // If username is changing, update the username map
    if (userData.username && userData.username !== existingUser.username) {
      this.usersByUsername.delete(existingUser.username);
      this.usersByUsername.set(userData.username, { ...existingUser, ...userData });
    }
    
    // If email is changing, update the email map
    if (userData.email && userData.email !== existingUser.email) {
      this.usersByEmail.delete(existingUser.email);
      this.usersByEmail.set(userData.email, { ...existingUser, ...userData });
    }
    
    // Update the main user record
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }
}

// Export a singleton instance
export const storage = new MemStorage();