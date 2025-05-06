import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { 
  fighters,
  fightHistory,
  fightStats,
  fighterComparisons,
  predictionHistory,
  type Fighter,
  type InsertFighter,
  type FightHistory,
  type InsertFightHistory,
  type FightStats,
  type InsertFightStats,
  type FighterComparison,
  type InsertFighterComparison,
  type PredictionHistory,
  type InsertPredictionHistory
} from "@shared/schema";
import { ComparisonStat } from "../client/src/types";
import { users, type User, type InsertUser } from "@shared/auth-schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Fighter operations
  async getAllFighters(): Promise<Fighter[]> {
    return await db.select().from(fighters);
  }

  async getFighterById(id: number): Promise<Fighter | undefined> {
    const result = await db.select().from(fighters).where(eq(fighters.id, id));
    return result[0];
  }

  async createFighter(fighter: InsertFighter): Promise<Fighter> {
    const result = await db.insert(fighters).values(fighter).returning();
    return result[0];
  }

  // Fight stats operations
  async getFighterStatsById(fighterId: number): Promise<FightStats | undefined> {
    const result = await db.select().from(fightStats).where(eq(fightStats.fighterId, fighterId));
    return result[0];
  }

  async createFighterStats(stats: InsertFightStats): Promise<FightStats> {
    const result = await db.insert(fightStats).values(stats).returning();
    return result[0];
  }

  // Fight history operations
  async getFighterHistoryById(fighterId: number): Promise<FightHistory[]> {
    return await db.select().from(fightHistory).where(eq(fightHistory.fighterId, fighterId));
  }

  async createFightHistory(history: InsertFightHistory): Promise<FightHistory> {
    const result = await db.insert(fightHistory).values(history).returning();
    return result[0];
  }

  // Featured fight - Hardcoded for now since it's specific to application needs
  async getFeaturedFight(): Promise<any> {
    // Get Jon Jones and Stipe Miocic (or any two fighters if they don't exist)
    const allFighters = await this.getAllFighters();
    const jonJones = allFighters.find(f => f.name === "Jon Jones") || allFighters[0];
    const stipeMiocic = allFighters.find(f => f.name === "Stipe Miocic") || allFighters[1];
    
    if (!jonJones || !stipeMiocic) {
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
      fighter1: jonJones,
      fighter2: stipeMiocic,
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

  // Fighter comparison operations
  async getAllFighterComparisons(): Promise<FighterComparison[]> {
    return await db.select().from(fighterComparisons);
  }

  async getFighterComparisonById(id: number): Promise<FighterComparison | undefined> {
    const result = await db.select().from(fighterComparisons).where(eq(fighterComparisons.id, id));
    return result[0];
  }

  async getFighterComparisonsByUserId(userId: number): Promise<FighterComparison[]> {
    return await db.select().from(fighterComparisons).where(eq(fighterComparisons.userId, userId));
  }

  async createFighterComparison(comparison: InsertFighterComparison): Promise<FighterComparison> {
    const result = await db.insert(fighterComparisons).values(comparison).returning();
    return result[0];
  }

  async updateFighterComparison(id: number, comparisonData: Partial<FighterComparison>): Promise<FighterComparison | undefined> {
    const result = await db.update(fighterComparisons)
      .set(comparisonData)
      .where(eq(fighterComparisons.id, id))
      .returning();
    return result[0];
  }

  async deleteFighterComparison(id: number): Promise<boolean> {
    const result = await db.delete(fighterComparisons).where(eq(fighterComparisons.id, id)).returning();
    return result.length > 0;
  }

  // Prediction history operations
  async getAllPredictionHistory(): Promise<PredictionHistory[]> {
    return await db.select().from(predictionHistory).orderBy(desc(predictionHistory.createdAt));
  }

  async getPredictionHistoryById(id: number): Promise<PredictionHistory | undefined> {
    const result = await db.select().from(predictionHistory).where(eq(predictionHistory.id, id));
    return result[0];
  }

  async getPredictionHistoryByUserId(userId: number): Promise<PredictionHistory[]> {
    return await db.select()
      .from(predictionHistory)
      .where(eq(predictionHistory.userId, userId))
      .orderBy(desc(predictionHistory.createdAt));
  }
  
  async getPredictionHistoryByFighters(fighter1Id: number, fighter2Id: number): Promise<PredictionHistory[]> {
    // Query for predictions that include both fighters (in either position)
    const option1 = await db.select()
      .from(predictionHistory)
      .where(and(
        eq(predictionHistory.fighter1Id, fighter1Id),
        eq(predictionHistory.fighter2Id, fighter2Id)
      ))
      .orderBy(desc(predictionHistory.createdAt));
      
    const option2 = await db.select()
      .from(predictionHistory)
      .where(and(
        eq(predictionHistory.fighter1Id, fighter2Id),
        eq(predictionHistory.fighter2Id, fighter1Id)
      ))
      .orderBy(desc(predictionHistory.createdAt));
      
    return [...option1, ...option2];
  }

  async createPredictionHistory(prediction: InsertPredictionHistory): Promise<PredictionHistory> {
    const result = await db.insert(predictionHistory).values(prediction).returning();
    return result[0];
  }

  async updatePredictionHistory(id: number, predictionData: Partial<PredictionHistory>): Promise<PredictionHistory | undefined> {
    const result = await db.update(predictionHistory)
      .set(predictionData)
      .where(eq(predictionHistory.id, id))
      .returning();
    return result[0];
  }

  async deletePredictionHistory(id: number): Promise<boolean> {
    const result = await db.delete(predictionHistory).where(eq(predictionHistory.id, id)).returning();
    return result.length > 0;
  }

  // User authentication
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
}