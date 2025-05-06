import { Fighter } from "@/types";

// Interface for the AI analysis result
interface AIAnalysisResult {
  fighter1WinProbability: number;
  fighter2WinProbability: number;
  analysis: string;
  predictionConfidence: number;
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

/**
 * Analyze fighters and predict fight outcome using server API endpoint
 */
export async function analyzeMatchup(
  fighter1: Fighter, 
  fighter2: Fighter,
  options: { fightType: string; weightClass: string; venueType: string }
): Promise<AIAnalysisResult> {
  try {
    const response = await fetch('/api/predict-matchup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fighter1,
        fighter2,
        options
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const result: AIAnalysisResult = await response.json();
    return result;
  } catch (error) {
    console.error("Error in AI analysis:", error);
    // Return a basic result if API call fails
    return {
      fighter1WinProbability: 50,
      fighter2WinProbability: 50,
      analysis: `We could not complete an AI analysis for this matchup. Please try again later.`,
      predictionConfidence: 0
    };
  }
}

/**
 * Generate strategy recommendations for a fighter
 */
export async function generateFightStrategy(
  fighter: Fighter,
  opponent: Fighter,
  fightType: string
): Promise<string> {
  try {
    const response = await fetch('/api/generate-strategy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fighter,
        opponent,
        fightType
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.strategy || "We could not generate a strategy at this time. Please try again later.";
  } catch (error) {
    console.error("Error in strategy generation:", error);
    return "We could not generate a strategy at this time. Please try again later.";
  }
}