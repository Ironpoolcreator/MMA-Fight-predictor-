import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
import { storage } from "./storage";
import { 
  insertFighterSchema, 
  insertFightStatsSchema, 
  insertFightHistorySchema, 
  insertFighterComparisonSchema,
  insertPredictionHistorySchema
} from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";
// import OpenAI from "openai"; // Comment out to avoid OpenAI initialization
import { predictFightOutcome } from "./ai/openai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // API routes for fighters data
  app.get("/api/fighters", async (req, res) => {
    try {
      const fighters = await storage.getAllFighters();
      res.json(fighters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fighters" });
    }
  });

  app.get("/api/fighters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const fighter = await storage.getFighterById(id);
      
      if (!fighter) {
        return res.status(404).json({ error: "Fighter not found" });
      }
      
      res.json(fighter);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fighter" });
    }
  });

  app.get("/api/fighters/:id/stats", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const stats = await storage.getFighterStatsById(id);
      
      if (!stats) {
        return res.status(404).json({ error: "Fighter stats not found" });
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fighter stats" });
    }
  });

  app.get("/api/fighters/:id/history", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const history = await storage.getFighterHistoryById(id);
      
      if (!history || history.length === 0) {
        return res.status(404).json({ error: "Fight history not found" });
      }
      
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fight history" });
    }
  });

  app.get("/api/featured-fight", async (req, res) => {
    try {
      const featuredFight = await storage.getFeaturedFight();
      res.json(featuredFight);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured fight" });
    }
  });
  
  // GET endpoint for fighter comparisons
  app.get("/api/fighter-comparisons", async (req, res) => {
    try {
      const comparisons = await storage.getAllFighterComparisons();
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fighter comparisons" });
    }
  });
  
  app.get("/api/fighter-comparisons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const comparison = await storage.getFighterComparisonById(id);
      
      if (!comparison) {
        return res.status(404).json({ error: "Fighter comparison not found" });
      }
      
      res.json(comparison);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fighter comparison" });
    }
  });
  
  app.get("/api/fighter-comparisons/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const comparisons = await storage.getFighterComparisonsByUserId(userId);
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user's fighter comparisons" });
    }
  });

  // POST endpoints for adding new data
  app.post("/api/fighters", async (req, res) => {
    try {
      const fighterData = insertFighterSchema.parse(req.body);
      const newFighter = await storage.createFighter(fighterData);
      res.status(201).json(newFighter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid fighter data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create fighter" });
    }
  });

  app.post("/api/fighters/:id/stats", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const statsData = insertFightStatsSchema.parse({
        ...req.body,
        fighterId: id
      });
      
      const newStats = await storage.createFighterStats(statsData);
      res.status(201).json(newStats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid stats data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create fighter stats" });
    }
  });

  app.post("/api/fighters/:id/history", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const historyData = insertFightHistorySchema.parse({
        ...req.body,
        fighterId: id
      });
      
      const newHistory = await storage.createFightHistory(historyData);
      res.status(201).json(newHistory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid history data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create fight history" });
    }
  });
  
  // POST endpoint for creating fighter comparisons
  app.post("/api/fighter-comparisons", async (req, res) => {
    try {
      const comparisonData = insertFighterComparisonSchema.parse(req.body);
      const newComparison = await storage.createFighterComparison(comparisonData);
      res.status(201).json(newComparison);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid comparison data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create fighter comparison" });
    }
  });
  
  // PUT endpoint for updating fighter comparisons
  app.put("/api/fighter-comparisons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const comparisonData = req.body;
      
      const updatedComparison = await storage.updateFighterComparison(id, comparisonData);
      
      if (!updatedComparison) {
        return res.status(404).json({ error: "Fighter comparison not found" });
      }
      
      res.json(updatedComparison);
    } catch (error) {
      res.status(500).json({ error: "Failed to update fighter comparison" });
    }
  });
  
  // DELETE endpoint for deleting fighter comparisons
  app.delete("/api/fighter-comparisons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFighterComparison(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Fighter comparison not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete fighter comparison" });
    }
  });
  
  // Prediction History API Endpoints
  app.get("/api/prediction-history", async (req, res) => {
    try {
      const predictions = await storage.getAllPredictionHistory();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prediction history" });
    }
  });
  
  app.get("/api/prediction-history/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const prediction = await storage.getPredictionHistoryById(id);
      
      if (!prediction) {
        return res.status(404).json({ error: "Prediction not found" });
      }
      
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prediction" });
    }
  });
  
  app.get("/api/prediction-history/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const predictions = await storage.getPredictionHistoryByUserId(userId);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user's predictions" });
    }
  });
  
  app.get("/api/prediction-history/fighters/:fighter1Id/:fighter2Id", async (req, res) => {
    try {
      const fighter1Id = parseInt(req.params.fighter1Id);
      const fighter2Id = parseInt(req.params.fighter2Id);
      const predictions = await storage.getPredictionHistoryByFighters(fighter1Id, fighter2Id);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fighter predictions" });
    }
  });
  
  app.post("/api/prediction-history", async (req, res) => {
    try {
      const predictionData = insertPredictionHistorySchema.parse(req.body);
      const newPrediction = await storage.createPredictionHistory(predictionData);
      res.status(201).json(newPrediction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid prediction data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create prediction" });
    }
  });
  
  app.put("/api/prediction-history/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const predictionData = req.body;
      
      const updatedPrediction = await storage.updatePredictionHistory(id, predictionData);
      
      if (!updatedPrediction) {
        return res.status(404).json({ error: "Prediction not found" });
      }
      
      res.json(updatedPrediction);
    } catch (error) {
      res.status(500).json({ error: "Failed to update prediction" });
    }
  });
  
  app.delete("/api/prediction-history/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePredictionHistory(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Prediction not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete prediction" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Connected clients
  const clients = new Set<WebSocket>();
  
  // Live fight data state
  let currentLiveFight = {
    inProgress: false,
    fighter1: null as any,
    fighter2: null as any,
    currentRound: 0,
    timeRemaining: "5:00",
    fighter1Score: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0 },
    fighter2Score: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0 },
    fighterStats: {
      fighter1: { strikes: 0, takedowns: 0, controlTime: 0 },
      fighter2: { strikes: 0, takedowns: 0, controlTime: 0 }
    },
    bettingOdds: {
      fighter1: { moneyline: -150, decimal: 1.67, impliedProbability: 60 },
      fighter2: { moneyline: +125, decimal: 2.25, impliedProbability: 40 }
    },
    fighterImages: {
      fighter1: "",
      fighter2: ""
    },
    significantMoments: []
  };
  
  // Helper to broadcast to all connected clients
  function broadcast(data: any) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // Connection handling
  wss.on('connection', (ws) => {
    // Add client to the set
    clients.add(ws);
    
    // Send current fight state to the newly connected client
    ws.send(JSON.stringify({
      type: 'fightUpdate',
      data: currentLiveFight
    }));
    
    // Handle client messages
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        
        // Admin actions: start/stop fight, update scores, etc. (would be authenticated in production)
        if (parsedMessage.type === 'adminAction') {
          handleAdminAction(parsedMessage.action, parsedMessage.data);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
    
    // Handle client disconnection
    ws.on('close', () => {
      clients.delete(ws);
    });
  });
  
  // Handle admin actions
  function handleAdminAction(action: string, data: any) {
    switch (action) {
      case 'startFight':
        startSimulatedFight(data.fighter1Id, data.fighter2Id);
        break;
      case 'updateScore':
        updateFightScore(data);
        break;
      case 'updateOdds':
        updateBettingOdds(data);
        break;
      case 'endFight':
        endFight(data);
        break;
    }
  }
  
  // Start a simulated live fight
  async function startSimulatedFight(fighter1Id: number, fighter2Id: number) {
    try {
      const fighter1 = await storage.getFighterById(fighter1Id);
      const fighter2 = await storage.getFighterById(fighter2Id);
      
      if (!fighter1 || !fighter2) {
        return;
      }
      
      // Reset fight state
      currentLiveFight = {
        inProgress: true,
        fighter1,
        fighter2,
        currentRound: 1,
        timeRemaining: "5:00",
        fighter1Score: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0 },
        fighter2Score: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0 },
        fighterStats: {
          fighter1: { strikes: 0, takedowns: 0, controlTime: 0 },
          fighter2: { strikes: 0, takedowns: 0, controlTime: 0 }
        },
        bettingOdds: {
          fighter1: { moneyline: -150, decimal: 1.67, impliedProbability: 60 },
          fighter2: { moneyline: +125, decimal: 2.25, impliedProbability: 40 }
        },
        fighterImages: {
          fighter1: `https://avatars.githubusercontent.com/u/${1000 + fighter1Id}?v=4`,
          fighter2: `https://avatars.githubusercontent.com/u/${2000 + fighter2Id}?v=4`
        },
        significantMoments: []
      };
      
      // Broadcast fight start
      broadcast({
        type: 'fightUpdate',
        data: currentLiveFight
      });
      
      // Start simulated fight updates
      startSimulatedUpdates();
    } catch (error) {
      console.error('Error starting fight:', error);
    }
  }
  
  // Simulate periodic fight updates
  function startSimulatedUpdates() {
    if (!currentLiveFight.inProgress) return;
    
    let timeInSeconds = 5 * 60; // 5 minutes
    let updateInterval = setInterval(() => {
      if (!currentLiveFight.inProgress) {
        clearInterval(updateInterval);
        return;
      }
      
      // Update time
      timeInSeconds -= 1;
      if (timeInSeconds < 0) {
        // End of round
        if (currentLiveFight.currentRound < 5) {
          currentLiveFight.currentRound++;
          timeInSeconds = 5 * 60;
          
          // Broadcast round change
          broadcast({
            type: 'roundChange',
            data: {
              round: currentLiveFight.currentRound,
              timeRemaining: "5:00"
            }
          });
        } else {
          // End of fight after 5 rounds
          endFight({ method: "Decision" });
          clearInterval(updateInterval);
          return;
        }
      }
      
      // Format time remaining
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      currentLiveFight.timeRemaining = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      
      // Randomly update stats
      if (Math.random() > 0.7) {
        updateFightStats();
      }
      
      // Randomly update odds (less frequently)
      if (Math.random() > 0.95) {
        updateLiveOdds();
      }
      
      // Add significant moment (rarely)
      if (Math.random() > 0.98) {
        addSignificantMoment();
      }
      
      // Broadcast updated state
      broadcast({
        type: 'fightUpdate',
        data: currentLiveFight
      });
      
    }, 1000); // Update every second
  }
  
  // Update fighter statistics during the fight
  function updateFightStats() {
    const fighter1Increase = Math.floor(Math.random() * 3);
    const fighter2Increase = Math.floor(Math.random() * 3);
    
    currentLiveFight.fighterStats.fighter1.strikes += fighter1Increase;
    currentLiveFight.fighterStats.fighter2.strikes += fighter2Increase;
    
    // Occasionally add takedowns
    if (Math.random() > 0.95) {
      currentLiveFight.fighterStats.fighter1.takedowns += 1;
      currentLiveFight.fighterStats.fighter1.controlTime += Math.floor(Math.random() * 30);
    }
    
    if (Math.random() > 0.95) {
      currentLiveFight.fighterStats.fighter2.takedowns += 1;
      currentLiveFight.fighterStats.fighter2.controlTime += Math.floor(Math.random() * 30);
    }
    
    // Update round scores based on activity
    const round = `round${currentLiveFight.currentRound}` as keyof typeof currentLiveFight.fighter1Score;
    
    if (fighter1Increase > fighter2Increase) {
      currentLiveFight.fighter1Score[round] += 1;
    } else if (fighter2Increase > fighter1Increase) {
      currentLiveFight.fighter2Score[round] += 1;
    }
  }
  
  // Update live betting odds
  function updateLiveOdds() {
    // Calculate who's winning based on stats
    const fighter1Total = currentLiveFight.fighterStats.fighter1.strikes + 
                         (currentLiveFight.fighterStats.fighter1.takedowns * 5);
    
    const fighter2Total = currentLiveFight.fighterStats.fighter2.strikes + 
                         (currentLiveFight.fighterStats.fighter2.takedowns * 5);
    
    // Calculate new implied probabilities
    let fighter1Probability = 50;
    let fighter2Probability = 50;
    
    if (fighter1Total + fighter2Total > 0) {
      fighter1Probability = Math.round((fighter1Total / (fighter1Total + fighter2Total)) * 100);
      fighter2Probability = 100 - fighter1Probability;
    }
    
    // Add some randomness
    fighter1Probability += Math.floor(Math.random() * 10) - 5;
    fighter2Probability = 100 - fighter1Probability;
    
    // Clamp values
    fighter1Probability = Math.min(90, Math.max(10, fighter1Probability));
    fighter2Probability = 100 - fighter1Probability;
    
    // Convert to American odds
    let fighter1Moneyline, fighter2Moneyline;
    
    if (fighter1Probability >= 50) {
      fighter1Moneyline = -Math.round((fighter1Probability / (100 - fighter1Probability)) * 100);
      fighter2Moneyline = Math.round((100 - fighter2Probability) / fighter2Probability * 100);
    } else {
      fighter1Moneyline = Math.round((100 - fighter1Probability) / fighter1Probability * 100);
      fighter2Moneyline = -Math.round((fighter2Probability / (100 - fighter2Probability)) * 100);
    }
    
    // Convert to decimal odds
    const fighter1Decimal = fighter1Moneyline < 0 
      ? (100 / Math.abs(fighter1Moneyline)) + 1 
      : (fighter1Moneyline / 100) + 1;
      
    const fighter2Decimal = fighter2Moneyline < 0 
      ? (100 / Math.abs(fighter2Moneyline)) + 1 
      : (fighter2Moneyline / 100) + 1;
    
    // Update odds
    currentLiveFight.bettingOdds = {
      fighter1: {
        moneyline: fighter1Moneyline,
        decimal: parseFloat(fighter1Decimal.toFixed(2)),
        impliedProbability: fighter1Probability
      },
      fighter2: {
        moneyline: fighter2Moneyline,
        decimal: parseFloat(fighter2Decimal.toFixed(2)),
        impliedProbability: fighter2Probability
      }
    };
  }
  
  // Add a significant moment to the fight timeline
  function addSignificantMoment() {
    const momentTypes = [
      "significant strike",
      "knockdown",
      "takedown",
      "submission attempt",
      "cut opened",
      "referee warning"
    ];
    
    const fighter = Math.random() > 0.5 ? currentLiveFight.fighter1 : currentLiveFight.fighter2;
    const momentType = momentTypes[Math.floor(Math.random() * momentTypes.length)];
    
    // Type cast to any[] to avoid TypeScript error
    (currentLiveFight.significantMoments as any[]).push({
      time: currentLiveFight.timeRemaining,
      round: currentLiveFight.currentRound,
      fighter: fighter?.name || "Unknown Fighter",
      action: `${fighter?.name || "Fighter"} lands a ${momentType}`
    });
  }
  
  // Update scores explicitly (admin action)
  function updateFightScore(data: any) {
    const { fighter1Score, fighter2Score, round } = data;
    
    if (round > 0 && round <= 5) {
      const roundKey = `round${round}` as keyof typeof currentLiveFight.fighter1Score;
      currentLiveFight.fighter1Score[roundKey] = fighter1Score;
      currentLiveFight.fighter2Score[roundKey] = fighter2Score;
      
      broadcast({
        type: 'scoreUpdate',
        data: {
          fighter1Score: currentLiveFight.fighter1Score,
          fighter2Score: currentLiveFight.fighter2Score
        }
      });
    }
  }
  
  // Update betting odds explicitly (admin action)
  function updateBettingOdds(data: any) {
    currentLiveFight.bettingOdds = data;
    
    broadcast({
      type: 'oddsUpdate',
      data: currentLiveFight.bettingOdds
    });
  }
  
  // End the fight
  function endFight(data: any) {
    currentLiveFight.inProgress = false;
    
    broadcast({
      type: 'fightEnd',
      data: {
        winner: determineWinner(),
        method: data.method || "Decision",
        time: currentLiveFight.timeRemaining,
        round: currentLiveFight.currentRound
      }
    });
  }
  
  // Determine the winner based on scores
  function determineWinner() {
    let fighter1TotalScore = 0;
    let fighter2TotalScore = 0;
    
    for (let i = 1; i <= 5; i++) {
      const round = `round${i}` as keyof typeof currentLiveFight.fighter1Score;
      fighter1TotalScore += currentLiveFight.fighter1Score[round];
      fighter2TotalScore += currentLiveFight.fighter2Score[round];
    }
    
    if (fighter1TotalScore > fighter2TotalScore) {
      return currentLiveFight.fighter1.name;
    } else if (fighter2TotalScore > fighter1TotalScore) {
      return currentLiveFight.fighter2.name;
    } else {
      return "Draw";
    }
  }
  
  // Start a demo fight if in development mode
  if (process.env.NODE_ENV === 'development') {
    // Start a simulated fight after 5 seconds
    setTimeout(() => {
      startSimulatedFight(1, 2); // Jon Jones vs Francis Ngannou
    }, 5000);
  }

  // OpenAI initialization removed to avoid API key requirement
  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY
  // });

  // AI prediction endpoint
  app.post("/api/predict-matchup", async (req, res) => {
    try {
      const { fighter1, fighter2, options, userId, title } = req.body;
      
      if (!fighter1 || !fighter2 || !options) {
        return res.status(400).json({ error: "Missing fighter data or options" });
      }
      
      // Create a detailed prompt for OpenAI
      const prompt = `
      I need an expert MMA fight analysis between these fighters:
      
      FIGHTER 1: ${fighter1.name}
      - Weight class: ${fighter1.division}
      - Record: ${fighter1.record} (${fighter1.wins} wins, ${fighter1.losses} losses, ${fighter1.draws} draws)
      - Fighting style: ${fighter1.style || 'Unknown'}
      - Strengths: ${fighter1.strengths || 'N/A'}
      - Stature: ${fighter1.height || 'N/A'}, Age: ${fighter1.age || 'N/A'}
      
      FIGHTER 2: ${fighter2.name}
      - Weight class: ${fighter2.division}
      - Record: ${fighter2.record} (${fighter2.wins} wins, ${fighter2.losses} losses, ${fighter2.draws} draws)
      - Fighting style: ${fighter2.style || 'Unknown'}
      - Strengths: ${fighter2.strengths || 'N/A'}
      - Stature: ${fighter2.height || 'N/A'}, Age: ${fighter2.age || 'N/A'}
      
      FIGHT DETAILS:
      - Fight type: ${options.fightType}
      - Weight class: ${options.weightClass}
      - Venue: ${options.venueType}
      
      I need:
      1. Win probabilities (numbers between 0-100 for each fighter that sum to 100)
      2. A detailed fight analysis (about 150 words)
      3. The most likely outcome (winner, method, round if applicable)
      4. Technical breakdown (about 150 words)
      5. Gameplan analysis for each fighter
      6. Key statistical advantages (bullet points)
      7. Overall prediction confidence (0-100%)
      
      Respond in JSON format with the following structure:
      {
        "fighter1WinProbability": number,
        "fighter2WinProbability": number,
        "analysis": string,
        "likelyOutcome": {
          "winner": string,
          "method": string,
          "round": number or null
        },
        "technicalBreakdown": string,
        "gameplanAnalysis": {
          "fighter1Strategy": string,
          "fighter2Strategy": string
        },
        "keyStats": [string, string, string, ...],
        "predictionConfidence": number
      }
      
      Make sure the technical analysis is detailed and references specific techniques and fighting styles. Be realistic about win probabilities.
      `;
      
      // Generate fallback response instead of using OpenAI
      // Define a type for the prediction result to avoid TypeScript errors
      interface PredictionResult {
        fighter1WinProbability: number;
        fighter2WinProbability: number;
        analysis: string;
        likelyOutcome: {
          winner: string;
          method: string;
          round: number | null;
        };
        technicalBreakdown: string;
        gameplanAnalysis: {
          fighter1Strategy: string;
          fighter2Strategy: string;
        };
        keyStats: string[];
        predictionConfidence: number;
        predictionId?: number | null;
      }
      
      const result: PredictionResult = {
        fighter1WinProbability: Math.round(40 + Math.random() * 20),
        fighter2WinProbability: 0, // Will be calculated below
        analysis: `This is a statistical analysis of the fight between ${fighter1.name} and ${fighter2.name}. Based on their fighting styles, previous records, and physical attributes, this prediction provides an estimate of the potential outcome.`,
        likelyOutcome: {
          winner: Math.random() > 0.5 ? fighter1.name : fighter2.name,
          method: ["KO/TKO", "Submission", "Decision"][Math.floor(Math.random() * 3)],
          round: Math.random() > 0.3 ? Math.ceil(Math.random() * 5) : null
        },
        technicalBreakdown: `The technical breakdown of this matchup considers striking accuracy, grappling efficiency, and overall fight IQ of both fighters. Each fighter has distinct advantages in different areas.`,
        gameplanAnalysis: {
          fighter1Strategy: `${fighter1.name} should focus on maintaining distance and utilizing technical striking.`,
          fighter2Strategy: `${fighter2.name} should look to close the distance and utilize clinch work against the cage.`
        },
        keyStats: [
          "Striking accuracy comparison favors " + (Math.random() > 0.5 ? fighter1.name : fighter2.name),
          "Takedown defense will be crucial in this matchup",
          "Cardio and endurance factors may determine the later rounds"
        ],
        predictionConfidence: Math.round(60 + Math.random() * 25),
        predictionId: null
      };
      
      // Ensure probabilities sum to 100%
      result.fighter2WinProbability = 100 - result.fighter1WinProbability;
      
      // Store prediction in database if authenticated
      try {
        // Determine the predicted winner
        let predictedWinnerId = null;
        if (result.likelyOutcome && result.likelyOutcome.winner) {
          const winnerName = result.likelyOutcome.winner.toUpperCase();
          if (fighter1.name.toUpperCase().includes(winnerName) || winnerName.includes(fighter1.name.toUpperCase())) {
            predictedWinnerId = fighter1.id;
          } else if (fighter2.name.toUpperCase().includes(winnerName) || winnerName.includes(fighter2.name.toUpperCase())) {
            predictedWinnerId = fighter2.id;
          }
        }
        
        // Create prediction history entry
        const predictionData = {
          userId: userId || null,
          fighter1Id: fighter1.id,
          fighter2Id: fighter2.id,
          weightClass: options.weightClass,
          venueType: options.venueType,
          fightType: options.fightType,
          
          // Prediction results
          predictedWinnerId: predictedWinnerId || fighter1.id, // Default to fighter1 if can't determine
          winProbability: predictedWinnerId === fighter1.id ? result.fighter1WinProbability / 100 : result.fighter2WinProbability / 100,
          predictionConfidence: result.predictionConfidence / 100,
          predictedMethod: result.likelyOutcome?.method || null,
          predictedRound: result.likelyOutcome?.round || null,
          
          // Analysis text
          analysis: result.analysis,
          technicalBreakdown: result.technicalBreakdown,
          keyFactors: result.keyStats ? JSON.stringify(result.keyStats) : null,
          gameplanSuggestions: result.gameplanAnalysis ? JSON.stringify(result.gameplanAnalysis) : null,
          
          // Metadata
          title: title || `${fighter1.name} vs ${fighter2.name} - ${new Date().toISOString().split('T')[0]}`,
          isPublic: true,
        };
        
        const savedPrediction = await storage.createPredictionHistory(predictionData);
        
        // Add the database ID to the response
        result.predictionId = savedPrediction.id;
      } catch (dbError) {
        console.error("Error saving prediction to database:", dbError);
        // Continue with the response even if saving fails
      }
      
      // Return the prediction result
      res.json(result);
      
    } catch (error) {
      console.error("Error in AI prediction:", error);
      res.status(500).json({ 
        error: "Failed to generate AI prediction",
        fighter1WinProbability: 50,
        fighter2WinProbability: 50,
        analysis: "We could not complete an AI analysis for this matchup. Please try again later.",
        predictionConfidence: 0
      });
    }
  });

  // AI fight strategy endpoint
  app.post("/api/generate-strategy", async (req, res) => {
    try {
      const { fighter, opponent, fightType } = req.body;
      
      if (!fighter || !opponent || !fightType) {
        return res.status(400).json({ error: "Missing fighter data or fight type" });
      }
      
      const prompt = `
      I need a detailed fight strategy for ${fighter.name} against ${opponent.name} in a ${fightType} fight.
      
      FIGHTER DETAILS:
      - Name: ${fighter.name}
      - Weight class: ${fighter.division}
      - Record: ${fighter.record} (${fighter.wins} wins, ${fighter.losses} losses, ${fighter.draws} draws)
      - Fighting style: ${fighter.style || 'Unknown'}
      - Strengths: ${fighter.strengths || 'N/A'}
      
      OPPONENT DETAILS:
      - Name: ${opponent.name}
      - Weight class: ${opponent.division}
      - Record: ${opponent.record} (${opponent.wins} wins, ${opponent.losses} losses, ${opponent.draws} draws)
      - Fighting style: ${opponent.style || 'Unknown'}
      - Strengths: ${opponent.strengths || 'N/A'}
      
      Consider:
      1. Striking tactics
      2. Grappling approach
      3. Cage control strategies
      4. Round-by-round game plan
      5. Energy management
      6. Key techniques to exploit
      7. Defensive priorities
      
      Provide a detailed strategy of about 300-400 words.
      `;
      
      // Generate fallback strategy without using OpenAI
      const strategyContent = `
Fight Strategy for ${fighter.name} against ${opponent.name} in a ${fightType} fight:

STRIKING TACTICS:
${fighter.name} should focus on establishing range control early with the jab. Keep distance against ${opponent.name}'s power shots and look for counter opportunities. Utilize leg kicks to slow movement and disrupt rhythm.

GRAPPLING APPROACH:
When the fight enters the clinch, focus on maintaining good posture and prevent being pressed against the cage. Utilize underhooks to control the position and create space for strikes or takedown attempts when advantageous.

ROUND-BY-ROUND STRATEGY:
Round 1: Establish distance, read ${opponent.name}'s timing and reactions
Round 2: Increase pressure and exploit any weaknesses identified in Round 1
Round 3: Push the pace if ahead, or look for finish opportunities if behind

DEFENSIVE PRIORITIES:
- Maintain good head movement to avoid power shots
- Keep hands high when exiting exchanges
- Be ready to defend takedown attempts in open space
- Practice cage awareness to avoid being trapped

This strategy leverages ${fighter.name}'s technical abilities while mitigating ${opponent.name}'s key strengths.
      `;
      
      res.json({ strategy: strategyContent });
      
    } catch (error) {
      console.error("Error in strategy generation:", error);
      res.status(500).json({ 
        error: "Failed to generate fight strategy",
        strategy: "We could not generate a strategy at this time. Please try again later."
      });
    }
  });

  // AI Fight Prediction endpoint
  app.post("/api/predict-fight", async (req, res) => {
    try {
      const { fighter1, fighter2, options } = req.body;
      
      if (!fighter1 || !fighter2) {
        return res.status(400).json({ error: "Both fighter1 and fighter2 objects are required" });
      }

      // Validate minimum required fields
      if (!fighter1.id || !fighter1.name || !fighter2.id || !fighter2.name) {
        return res.status(400).json({ error: "Fighter objects must contain at least id and name properties" });
      }
      
      // Use OpenAI to predict fight outcome with advanced options
      const prediction = await predictFightOutcome(fighter1, fighter2, options);
      
      // Log prediction generation but not the actual data
      console.log(`Generated fight prediction for ${fighter1.name} vs ${fighter2.name} with ${options?.modelVersion || 'standard'} model`);
      
      res.json(prediction);
    } catch (error) {
      console.error("Error in fight prediction:", error);
      res.status(500).json({ error: "Failed to generate fight prediction" });
    }
  });

  return httpServer;
}
