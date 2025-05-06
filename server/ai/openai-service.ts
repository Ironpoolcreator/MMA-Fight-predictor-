// Import commented out to avoid initialization errors
// import OpenAI from "openai";

// OpenAI client initialization removed to avoid requiring API key
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

interface FighterData {
  id: number;
  name: string;
  record?: string;
  division?: string;
  strikingAccuracy?: string;
  strikesLandedPerMin?: string;
  takedownAccuracy?: string;
  takedownDefense?: string;
  knockoutWins?: string;
  submissionWins?: string;
  decisionWins?: string;
}

interface PredictionOptions {
  modelVersion?: string;
  includeRoundByRoundAnalysis?: boolean;
  detailedStyleMatchup?: boolean;
  confidenceThreshold?: number;
  includeHeadToHeadComparison?: boolean;
  includeHistoricalAnalysis?: boolean;
  includeStrategyBreakdown?: boolean;
  includeFightIQAnalysis?: boolean;
}

interface PredictionResult {
  winnerName: string;
  winnerId: number;
  confidence: number;
  method: string;
  round?: number;
  analysis: string;
  matchupInsights: string[];
  keyFactors: string[];
  roundByRoundPrediction?: any;
  styleDynamics?: any;
  headToHeadComparison?: any;
  fightIQAnalysis?: any;
  strategyBreakdown?: any;
}

// Helper function to format fighter data for the prompt
function generateFighterDataString(fighter: FighterData): string {
  let result = `NAME: ${fighter.name} (ID: ${fighter.id})\n`;
  
  if (fighter.record) result += `RECORD: ${fighter.record}\n`;
  if (fighter.division) result += `DIVISION: ${fighter.division}\n`;
  if (fighter.strikingAccuracy) result += `STRIKING ACCURACY: ${fighter.strikingAccuracy}\n`;
  if (fighter.strikesLandedPerMin) result += `STRIKES LANDED PER MIN: ${fighter.strikesLandedPerMin}\n`;
  if (fighter.takedownAccuracy) result += `TAKEDOWN ACCURACY: ${fighter.takedownAccuracy}\n`;
  if (fighter.takedownDefense) result += `TAKEDOWN DEFENSE: ${fighter.takedownDefense}\n`;
  if (fighter.knockoutWins) result += `KNOCKOUT WINS: ${fighter.knockoutWins}\n`;
  if (fighter.submissionWins) result += `SUBMISSION WINS: ${fighter.submissionWins}\n`;
  if (fighter.decisionWins) result += `DECISION WINS: ${fighter.decisionWins}\n`;
  
  return result;
}

// Fallback prediction function for when API is unavailable or rate-limited
function generateFallbackPrediction(fighter1: FighterData, fighter2: FighterData, isAdvanced: boolean = false): PredictionResult {
  console.log(`Generating fallback prediction for ${fighter1.name} vs ${fighter2.name} with ${isAdvanced ? 'advanced' : 'basic'} model`);
  
  // Convert string values to numbers for calculation
  const f1StrikeRate = parseFloat(fighter1.strikesLandedPerMin || '0');
  const f2StrikeRate = parseFloat(fighter2.strikesLandedPerMin || '0');
  const f1StrikeAcc = parseInt((fighter1.strikingAccuracy || '0%').replace('%', '')) / 100;
  const f2StrikeAcc = parseInt((fighter2.strikingAccuracy || '0%').replace('%', '')) / 100;
  const f1TDD = parseInt((fighter1.takedownDefense || '0%').replace('%', '')) / 100;
  const f2TDD = parseInt((fighter2.takedownDefense || '0%').replace('%', '')) / 100;
  const f1TDA = parseInt((fighter1.takedownAccuracy || '0%').replace('%', '')) / 100;
  const f2TDA = parseInt((fighter2.takedownAccuracy || '0%').replace('%', '')) / 100;
  const f1KOs = parseInt(fighter1.knockoutWins || '0');
  const f2KOs = parseInt(fighter2.knockoutWins || '0');
  const f1Subs = parseInt(fighter1.submissionWins || '0');
  const f2Subs = parseInt(fighter2.submissionWins || '0');
  const f1Decs = parseInt(fighter1.decisionWins || '0');
  const f2Decs = parseInt(fighter2.decisionWins || '0');
  
  // Calculate total wins
  const f1Wins = f1KOs + f1Subs + f1Decs;
  const f2Wins = f2KOs + f2Subs + f2Decs;
  
  // Calculate win method percentages
  const f1KOPct = f1Wins > 0 ? f1KOs / f1Wins : 0;
  const f1SubPct = f1Wins > 0 ? f1Subs / f1Wins : 0;
  const f1DecPct = f1Wins > 0 ? f1Decs / f1Wins : 0;
  
  const f2KOPct = f2Wins > 0 ? f2KOs / f2Wins : 0;
  const f2SubPct = f2Wins > 0 ? f2Subs / f2Wins : 0;
  const f2DecPct = f2Wins > 0 ? f2Decs / f2Wins : 0;
  
  // Scoring model - weighted factors
  const strikeOffenseWeight = 0.25;
  const strikeDefenseWeight = 0.15;
  const grappleOffenseWeight = 0.2;
  const grappleDefenseWeight = 0.15;
  const winRecordWeight = 0.25;
  
  // Calculate scores
  const f1StrikeOffense = f1StrikeRate * f1StrikeAcc * strikeOffenseWeight;
  const f2StrikeOffense = f2StrikeRate * f2StrikeAcc * strikeOffenseWeight;
  
  const f1StrikeDefense = (1 - f2StrikeAcc) * strikeDefenseWeight;
  const f2StrikeDefense = (1 - f1StrikeAcc) * strikeDefenseWeight;
  
  const f1GrappleOffense = f1TDA * grappleOffenseWeight;
  const f2GrappleOffense = f2TDA * grappleOffenseWeight;
  
  const f1GrappleDefense = f1TDD * grappleDefenseWeight;
  const f2GrappleDefense = f2TDD * grappleDefenseWeight;
  
  const f1WinRecord = f1Wins > 0 ? (f1Wins / (f1Wins + 1)) * winRecordWeight : 0.1 * winRecordWeight;
  const f2WinRecord = f2Wins > 0 ? (f2Wins / (f2Wins + 1)) * winRecordWeight : 0.1 * winRecordWeight;
  
  // Total scores
  const f1Score = f1StrikeOffense + f1StrikeDefense + f1GrappleOffense + f1GrappleDefense + f1WinRecord;
  const f2Score = f2StrikeOffense + f2StrikeDefense + f2GrappleOffense + f2GrappleDefense + f2WinRecord;
  
  // Determine winner and confidence
  let winner, loser, winnerScore, loserScore, winnerKOPct, winnerSubPct, winnerDecPct;
  let confidence, method, round;
  
  if (f1Score > f2Score) {
    winner = fighter1;
    loser = fighter2;
    winnerScore = f1Score;
    loserScore = f2Score;
    winnerKOPct = f1KOPct;
    winnerSubPct = f1SubPct;
    winnerDecPct = f1DecPct;
  } else {
    winner = fighter2;
    loser = fighter1;
    winnerScore = f2Score;
    loserScore = f1Score;
    winnerKOPct = f2KOPct;
    winnerSubPct = f2SubPct;
    winnerDecPct = f2DecPct;
  }
  
  // Calculate confidence based on score differential
  const scoreDiff = winnerScore - loserScore;
  const maxPossibleDiff = (strikeOffenseWeight + strikeDefenseWeight + grappleOffenseWeight + grappleDefenseWeight + winRecordWeight);
  const normalizedDiff = scoreDiff / maxPossibleDiff;
  confidence = Math.round(50 + (normalizedDiff * 40)); // 50-90 range
  
  // Determine method of victory based on fighter's history
  const methodRand = Math.random();
  if (methodRand < winnerKOPct) {
    method = "KO/TKO";
    round = Math.ceil(Math.random() * 3); // Most KOs happen in rounds 1-3
  } else if (methodRand < winnerKOPct + winnerSubPct) {
    method = "Submission";
    round = Math.ceil(Math.random() * 3); // Most subs happen in rounds 1-3
  } else {
    method = "Decision";
    round = undefined;
  }
  
  const winnerName = winner.name;
  const loserName = loser.name;
  
  // Determine the key advantages
  const strikingAdvantage = f1StrikeRate * f1StrikeAcc > f2StrikeRate * f2StrikeAcc ? fighter1.name : fighter2.name;
  const grapplingAdvantage = f1TDA > f2TDA ? fighter1.name : fighter2.name;
  const defenseAdvantage = (f1TDD + (1-f1StrikeAcc))/2 > (f2TDD + (1-f2StrikeAcc))/2 ? fighter1.name : fighter2.name;
  
  // Create analysis
  const analysis = `${winnerName} is predicted to win against ${loserName} through ${method}${round ? ` in round ${round}` : ''} based on statistical analysis. ${winnerName} demonstrates clear advantages in ${strikingAdvantage === winnerName ? 'striking output and accuracy' : grapplingAdvantage === winnerName ? 'grappling efficiency and control' : 'overall fighting metrics'}. This prediction is generated by statistical modeling of fight metrics and performance history.`;
  
  // Create matchup insights
  const matchupInsights = [
    `${strikingAdvantage} has superior striking metrics with ${strikingAdvantage === fighter1.name ? f1StrikeRate : f2StrikeRate} strikes landed per minute.`,
    `${grapplingAdvantage} holds an advantage in the grappling department with better takedown accuracy.`,
    `${defenseAdvantage} demonstrates better defensive skills in both striking and grappling exchanges.`,
    `${method === 'Decision' ? 'The fight is likely to go the distance based on both fighters\' finishing rates.' : `${winnerName} has a history of finishing fights via ${method}.`}`
  ];
  
  // Create key factors
  const keyFactors = [
    `${winnerName} has superior ${strikingAdvantage === winnerName ? 'striking' : grapplingAdvantage === winnerName ? 'grappling' : 'overall fighting'} metrics`,
    `${winnerName} demonstrates better ${f1TDD > f2TDD ? 'takedown defense' : 'striking defense'} that will be crucial in this matchup`,
    `${method !== 'Decision' ? `${winnerName}'s finishing ability via ${method} gives them a significant edge` : 'Fight IQ and consistency will be decisive in a likely decision'}`
  ];
  
  // Create advanced head-to-head comparison if needed
  const headToHeadComparison = {
    striking: {
      advantage: strikingAdvantage,
      rating: { 
        [fighter1.name]: Math.round((f1StrikeRate * f1StrikeAcc * 10) * 10) / 10, 
        [fighter2.name]: Math.round((f2StrikeRate * f2StrikeAcc * 10) * 10) / 10
      },
      analysis: `${strikingAdvantage} has more effective striking techniques and lands with greater accuracy. ${strikingAdvantage === fighter1.name ? fighter2.name : fighter1.name} will need to be defensively sound to avoid significant damage.`
    },
    grappling: {
      advantage: grapplingAdvantage,
      rating: { 
        [fighter1.name]: Math.round((f1TDA * 10) * 10) / 10, 
        [fighter2.name]: Math.round((f2TDA * 10) * 10) / 10
      },
      analysis: `${grapplingAdvantage} has a clear edge in takedown accuracy and control. The ground game could be a deciding factor if the fight goes to the mat.`
    },
    conditioning: {
      advantage: method === "Decision" ? winnerName : "Even",
      rating: { 
        [fighter1.name]: method === "Decision" && winner === fighter1 ? 8.5 : 7, 
        [fighter2.name]: method === "Decision" && winner === fighter2 ? 8.5 : 7 
      },
      analysis: `${method === "Decision" ? `${winnerName} has better endurance metrics suggesting an advantage in longer fights.` : "Both fighters appear to have comparable endurance levels."} Pace management will be crucial as the fight progresses.`
    },
    experience: {
      advantage: f1Wins > f2Wins ? fighter1.name : fighter2.name,
      rating: { 
        [fighter1.name]: f1Wins > f2Wins ? 8 : 7, 
        [fighter2.name]: f2Wins > f1Wins ? 8 : 7 
      },
      analysis: `${f1Wins > f2Wins ? fighter1.name : fighter2.name} has more professional wins and has faced higher caliber opposition. This experience advantage could prove valuable in critical moments.`
    }
  };
  
  // Create fight IQ analysis 
  const fightIQAnalysis = {
    strategic: { 
      [fighter1.name]: winner === fighter1 ? 8 : 6.5, 
      [fighter2.name]: winner === fighter2 ? 8 : 6.5 
    },
    tactical: { 
      [fighter1.name]: method === "Decision" && winner === fighter1 ? 8.5 : 7, 
      [fighter2.name]: method === "Decision" && winner === fighter2 ? 8.5 : 7 
    },
    adaptability: { 
      [fighter1.name]: winner === fighter1 ? 7.5 : 6.5, 
      [fighter2.name]: winner === fighter2 ? 7.5 : 6.5 
    },
    analysis: `${winnerName} demonstrates superior fight intelligence and tactical awareness based on historical performance metrics. Their ability to implement game plans and adapt mid-fight will likely be a determining factor.`
  };
  
  // Create strategy breakdown 
  const strategyBreakdown = {
    fighter1Path: [
      `Utilize ${f1StrikeRate > 3 ? "high-volume striking" : "precise counter striking"} to maintain optimal fighting distance`,
      `${f1TDA > 0.5 ? "Look for takedown opportunities when striking exchanges get wild" : "Defend takedowns and keep the fight standing"}`,
      `${f1KOPct > 0.5 ? "Commit to power shots to end the fight early" : f1SubPct > 0.3 ? "Seek submission opportunities if the fight goes to the ground" : "Win rounds through consistent technique and control"}`
    ],
    fighter2Path: [
      `${f2TDD > 0.7 ? "Use strong takedown defense to keep the fight standing" : "Use wrestling to control where the fight takes place"}`,
      `${f2SubPct > 0.3 ? "Look for submission opportunities when the fight hits the ground" : "Use ground control to score points and maintain dominance"}`,
      `${f2StrikeRate > 4 ? "High volume striking to overwhelm the opponent" : "Precision counter striking to capitalize on openings"}`
    ],
    keyTactics: [
      "Octagon control will be crucial for implementing game plans",
      `${winnerName} should focus on their clear advantage in ${strikingAdvantage === winnerName ? "striking" : grapplingAdvantage === winnerName ? "grappling" : "overall technique"}`,
      "Fight IQ and adaptability will play a major role as the fight progresses"
    ]
  };
  
  // Generate round-by-round analysis if advanced model
  const roundByRoundPrediction = isAdvanced ? {
    round1: `${winnerName} establishes distance control and begins implementing their game plan, likely winning the round through ${strikingAdvantage === winnerName ? 'superior striking' : 'control'}.`,
    round2: `${method !== "Decision" && round === 2 ? `${winnerName} finds an opening and finishes the fight via ${method}.` : `The fighters settle into their rhythms, with ${winnerName} generally having better success with their game plan.`}`,
    round3: `${method !== "Decision" && round === 3 ? `${winnerName} capitalizes on accumulated damage and finishes via ${method}.` : `Conditioning becomes a factor, with ${winnerName} maintaining better output and technique.`}`,
    round4: method !== "Decision" && round === 4 ? `${winnerName} finds an opening and finishes via ${method}.` : `Championship rounds test both fighters, with ${winnerName} showing better conditioning and execution.`,
    round5: method !== "Decision" && round === 5 ? `${winnerName} secures a late ${method} victory.` : `The final round sees ${winnerName} maintaining their game plan for a decision victory.`
  } : undefined;

  // Create the prediction result
  return {
    winnerName,
    winnerId: winner.id,
    confidence,
    method,
    round,
    analysis,
    matchupInsights,
    keyFactors,
    roundByRoundPrediction,
    styleDynamics: isAdvanced ? {
      paceControl: winnerName,
      rangeControl: strikingAdvantage,
      groundControl: grapplingAdvantage,
      clinchAdvantage: grapplingAdvantage,
      counterVsPressure: `${winnerName} is likely to implement a ${f1StrikeRate > 4 || f2StrikeRate > 4 ? 'pressure-heavy' : 'technical counter'} style`,
      styleDynamics: `${winnerName}'s ${strikingAdvantage === winnerName ? 'striking' : 'grappling'} style matches up favorably against ${loserName}'s approach.`
    } : undefined,
    headToHeadComparison: isAdvanced ? headToHeadComparison : undefined,
    fightIQAnalysis: isAdvanced ? fightIQAnalysis : undefined,
    strategyBreakdown: isAdvanced ? strategyBreakdown : undefined
  };
}

export async function predictFightOutcome(
  fighter1: FighterData,
  fighter2: FighterData,
  options?: PredictionOptions
): Promise<PredictionResult> {
  const isAdvancedModel = options?.modelVersion === 'advanced';
  
  // Always use fallback prediction system regardless of API key
  console.log(`Using fallback prediction for ${fighter1.name} vs ${fighter2.name} with ${isAdvancedModel ? 'advanced' : 'basic'} model`);
  return generateFallbackPrediction(fighter1, fighter2, isAdvancedModel);
}