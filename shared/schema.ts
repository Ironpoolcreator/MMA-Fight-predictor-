import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Table to store prediction history
export const predictionHistory = pgTable("prediction_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  fighter1Id: integer("fighter1_id").notNull(),
  fighter2Id: integer("fighter2_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  eventName: text("event_name"),
  weightClass: text("weight_class"),
  venueType: text("venue_type"),
  fightType: text("fight_type"),
  
  // Prediction results
  predictedWinnerId: integer("predicted_winner_id").notNull(),
  winProbability: real("win_probability"),
  predictionConfidence: real("prediction_confidence"),
  predictedMethod: text("predicted_method"),
  predictedRound: integer("predicted_round"),
  
  // Detailed analysis in JSON format
  analysis: text("analysis"),
  technicalBreakdown: text("technical_breakdown"),
  keyFactors: jsonb("key_factors"),
  gameplanSuggestions: jsonb("gameplan_suggestions"),
  
  // For tracking prediction accuracy over time (to be filled after fight occurs)
  actualWinnerId: integer("actual_winner_id"),
  actualMethod: text("actual_method"),
  actualRound: integer("actual_round"),
  wasPredictionCorrect: boolean("was_prediction_correct"),
  
  // For sharing and visibility
  isPublic: boolean("is_public").default(false),
  title: text("title"),
  notes: text("notes"),
});

// This table will store saved fighter comparisons
export const fighterComparisons = pgTable("fighter_comparisons", {
  id: serial("id").primaryKey(),
  fighter1Id: integer("fighter1_id").notNull(),
  fighter2Id: integer("fighter2_id").notNull(),
  userId: integer("user_id"),
  title: text("title").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  predictionSummary: text("prediction_summary"),
  predictionScore: integer("prediction_score"),
  isPublic: boolean("is_public").default(false),
});

export const fighters = pgTable("fighters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nickname: text("nickname"),
  division: text("division").notNull(),
  record: text("record").notNull(),
  wins: integer("wins").notNull(),
  losses: integer("losses").notNull(),
  draws: integer("draws").notNull(),
  noContests: integer("no_contests").default(0),
  age: integer("age"),
  height: text("height"),
  weight: text("weight"),
  reach: text("reach"),
  stance: text("stance"),
  team: text("team"),
  location: text("location"),
  image: text("image"),
  isChampion: boolean("is_champion").default(false),
  style: text("style"),
  strengths: text("strengths"),
  weaknesses: text("weaknesses"),
  winsByKO: integer("wins_by_ko").default(0),
  winsBySub: integer("wins_by_sub").default(0),
  winsByDec: integer("wins_by_dec").default(0),
  ranking: integer("ranking"),
});

export const fightHistory = pgTable("fight_history", {
  id: serial("id").primaryKey(),
  fighterId: integer("fighter_id").notNull(),
  opponent: text("opponent").notNull(),
  result: text("result").notNull(),
  method: text("method").notNull(),
  round: integer("round"),
  time: text("time"),
  event: text("event"),
  date: text("date"),
});

export const fightStats = pgTable("fight_stats", {
  id: serial("id").primaryKey(),
  fighterId: integer("fighter_id").notNull(),
  strikesLandedPerMin: text("strikes_landed_per_min"),
  strikesLanded: integer("strikes_landed"),
  strikingAccuracy: integer("striking_accuracy"),
  strikesAbsorbedPerMin: text("strikes_absorbed_per_min"),
  strikingDefense: integer("striking_defense"),
  takedownAvgPer15Min: text("takedown_avg_per_15min"),
  takedownAccuracy: integer("takedown_accuracy"),
  takedownDefense: integer("takedown_defense"),
  submissionAttempts: integer("submission_attempts"),
  submissionAvgPer15Min: text("submission_avg_per_15min"),
  controlTimeAvg: text("control_time_avg"),
  controlTimePercentage: integer("control_time_percentage"),
  knockoutPercentage: integer("knockout_percentage"),
  submissionPercentage: integer("submission_percentage"),
  decisionPercentage: integer("decision_percentage"),
  significantStrikeDefense: integer("significant_strike_defense"),
  knockdownAvgPer15Min: text("knockdown_avg_per_15min"),
  winStreak: integer("win_streak").default(0),
  lossStreak: integer("loss_streak").default(0),
  totalFightTime: text("total_fight_time"),
  averageFightTime: text("average_fight_time"),
});

export const insertFighterSchema = createInsertSchema(fighters).omit({ id: true });
export const insertFightHistorySchema = createInsertSchema(fightHistory).omit({ id: true });
export const insertFightStatsSchema = createInsertSchema(fightStats).omit({ id: true });
export const insertFighterComparisonSchema = createInsertSchema(fighterComparisons).omit({ id: true, createdAt: true });
export const insertPredictionHistorySchema = createInsertSchema(predictionHistory).omit({ id: true, createdAt: true });

export type InsertFighter = z.infer<typeof insertFighterSchema>;
export type InsertFightHistory = z.infer<typeof insertFightHistorySchema>;
export type InsertFightStats = z.infer<typeof insertFightStatsSchema>;
export type InsertFighterComparison = z.infer<typeof insertFighterComparisonSchema>;
export type InsertPredictionHistory = z.infer<typeof insertPredictionHistorySchema>;

export type Fighter = typeof fighters.$inferSelect;
export type FightHistory = typeof fightHistory.$inferSelect;
export type FightStats = typeof fightStats.$inferSelect;
export type FighterComparison = typeof fighterComparisons.$inferSelect;
export type PredictionHistory = typeof predictionHistory.$inferSelect;
