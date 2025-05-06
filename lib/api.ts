import { Fighter, FightHistory, FightStats, FeaturedFight } from '@/types';
import { fightersData } from '@/data/fighters';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all fighters
export async function getFighters(): Promise<Fighter[]> {
  await delay(500);
  
  // Simulate API request
  try {
    return await fetch('/api/fighters')
      .then(res => res.json())
      .catch(() => {
        // Fallback to static data if API fails
        return fightersData;
      });
  } catch (error) {
    console.error('Error fetching fighters:', error);
    return fightersData;
  }
}

// Get fighter by ID
export async function getFighterById(id: string): Promise<Fighter> {
  await delay(600);
  
  // Simulate API request
  try {
    return await fetch(`/api/fighters/${id}`)
      .then(res => res.json())
      .catch(() => {
        // Fallback to static data if API fails
        const fighter = fightersData.find(f => f.id.toString() === id);
        if (!fighter) throw new Error('Fighter not found');
        return fighter;
      });
  } catch (error) {
    console.error(`Error fetching fighter with ID ${id}:`, error);
    const fighter = fightersData.find(f => f.id.toString() === id);
    if (!fighter) throw new Error('Fighter not found');
    return fighter;
  }
}

// Get fighter stats by fighter ID
export async function getFighterStats(id: string): Promise<FightStats> {
  await delay(800);
  
  // Simulate API request
  try {
    return await fetch(`/api/fighters/${id}/stats`)
      .then(res => res.json())
      .catch(() => {
        // Fallback to generated data if API fails
        return {
          id: parseInt(id),
          fighterId: parseInt(id),
          strikesLanded: Math.floor(Math.random() * 1000) + 500,
          strikingAccuracy: Math.floor(Math.random() * 30) + 50,
          strikesAbsorbedPerMin: (Math.random() * 3 + 1).toFixed(1),
          strikingDefense: Math.floor(Math.random() * 25) + 50,
          takedownAccuracy: Math.floor(Math.random() * 40) + 40,
          takedownDefense: Math.floor(Math.random() * 30) + 65,
          submissionAttempts: Math.floor(Math.random() * 15) + 1,
          controlTimeAvg: `${Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
          knockoutPercentage: Math.floor(Math.random() * 50) + 10,
          submissionPercentage: Math.floor(Math.random() * 40) + 5,
          decisionPercentage: Math.floor(Math.random() * 50) + 20,
        };
      });
  } catch (error) {
    console.error(`Error fetching stats for fighter with ID ${id}:`, error);
    return {
      id: parseInt(id),
      fighterId: parseInt(id),
      strikesLanded: Math.floor(Math.random() * 1000) + 500,
      strikingAccuracy: Math.floor(Math.random() * 30) + 50,
      strikesAbsorbedPerMin: (Math.random() * 3 + 1).toFixed(1),
      strikingDefense: Math.floor(Math.random() * 25) + 50,
      takedownAccuracy: Math.floor(Math.random() * 40) + 40,
      takedownDefense: Math.floor(Math.random() * 30) + 65,
      submissionAttempts: Math.floor(Math.random() * 15) + 1,
      controlTimeAvg: `${Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
      knockoutPercentage: Math.floor(Math.random() * 50) + 10,
      submissionPercentage: Math.floor(Math.random() * 40) + 5,
      decisionPercentage: Math.floor(Math.random() * 50) + 20,
    };
  }
}

// Get fighter fight history by fighter ID
export async function getFighterFightHistory(id: string): Promise<FightHistory[]> {
  await delay(700);
  
  // Simulate API request
  try {
    return await fetch(`/api/fighters/${id}/history`)
      .then(res => res.json())
      .catch(() => {
        // Fallback to generated data if API fails
        const opponents = [
          "Ciryl Gane", "Stipe Miocic", "Dominick Reyes", 
          "Thiago Santos", "Anthony Smith", "Alexander Gustafsson",
          "Daniel Cormier", "Glover Teixeira", "Volkan Oezdemir"
        ];
        
        const methods = [
          "KO/TKO", "SUB", "DEC", "DEC", "SUB", "KO/TKO"
        ];
        
        const events = [
          "UFC 285", "UFC 247", "UFC 239", "UFC 235",
          "UFC 232", "UFC 214", "UFC 200", "UFC 197", "UFC 182"
        ];
        
        const results = ["win", "win", "win", "win", "loss", "win", "win", "draw", "win"];
        
        // Generate random fight history
        return Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          fighterId: parseInt(id),
          opponent: opponents[Math.floor(Math.random() * opponents.length)],
          result: results[Math.floor(Math.random() * results.length)],
          method: methods[Math.floor(Math.random() * methods.length)],
          round: Math.floor(Math.random() * 5) + 1,
          time: `${Math.floor(Math.random() * 4) + 1}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
          event: events[Math.floor(Math.random() * events.length)],
          date: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Math.floor(Math.random() * 12)]} ${Math.floor(Math.random() * 28) + 1}, ${Math.floor(Math.random() * 4) + 2020}`,
        }));
      });
  } catch (error) {
    console.error(`Error fetching fight history for fighter with ID ${id}:`, error);
    const opponents = [
      "Ciryl Gane", "Stipe Miocic", "Dominick Reyes", 
      "Thiago Santos", "Anthony Smith", "Alexander Gustafsson",
      "Daniel Cormier", "Glover Teixeira", "Volkan Oezdemir"
    ];
    
    const methods = [
      "KO/TKO", "SUB", "DEC", "DEC", "SUB", "KO/TKO"
    ];
    
    const events = [
      "UFC 285", "UFC 247", "UFC 239", "UFC 235",
      "UFC 232", "UFC 214", "UFC 200", "UFC 197", "UFC 182"
    ];
    
    const results = ["win", "win", "win", "win", "loss", "win", "win", "draw", "win"];
    
    // Generate random fight history
    return Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      fighterId: parseInt(id),
      opponent: opponents[Math.floor(Math.random() * opponents.length)],
      result: results[Math.floor(Math.random() * results.length)],
      method: methods[Math.floor(Math.random() * methods.length)],
      round: Math.floor(Math.random() * 5) + 1,
      time: `${Math.floor(Math.random() * 4) + 1}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
      event: events[Math.floor(Math.random() * events.length)],
      date: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Math.floor(Math.random() * 12)]} ${Math.floor(Math.random() * 28) + 1}, ${Math.floor(Math.random() * 4) + 2020}`,
    }));
  }
}

// Get featured fight prediction
export async function getFeaturedFight(): Promise<FeaturedFight> {
  await delay(1000);
  
  try {
    return await fetch('/api/featured-fight')
      .then(res => res.json())
      .catch(() => {
        // Fallback to static data
        const jonJones = fightersData.find(f => f.name === "Jon Jones") || fightersData[0];
        const stipeMiocic = fightersData.find(f => f.name === "Stipe Miocic") || fightersData[1];
        
        return {
          fighter1: jonJones,
          fighter2: stipeMiocic,
          fighter1WinProbability: 65,
          fighter2WinProbability: 35,
          eventName: "UFC 300",
          eventDate: "April 13, 2024",
          confidenceScore: 87,
          comparisonStats: [
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
          ],
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
      });
  } catch (error) {
    console.error('Error fetching featured fight:', error);
    const jonJones = fightersData.find(f => f.name === "Jon Jones") || fightersData[0];
    const stipeMiocic = fightersData.find(f => f.name === "Stipe Miocic") || fightersData[1];
    
    return {
      fighter1: jonJones,
      fighter2: stipeMiocic,
      fighter1WinProbability: 65,
      fighter2WinProbability: 35,
      eventName: "UFC 300",
      eventDate: "April 13, 2024",
      confidenceScore: 87,
      comparisonStats: [
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
      ],
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
}
