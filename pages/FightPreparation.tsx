import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFighters } from '@/lib/api';
import { Fighter } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, Brain, Target, Info, FileText, ListChecks, Dumbbell, Flame, Shield } from 'lucide-react';
import FighterSearch from '@/components/FighterSearch';
import { useToast } from '@/hooks/use-toast';

// Define the available training focus areas
const trainingFocusAreas = [
  { id: 'striking', label: 'Striking' },
  { id: 'wrestling', label: 'Wrestling' },
  { id: 'bjj', label: 'Brazilian Jiu-Jitsu' },
  { id: 'clinch', label: 'Clinch Work' },
  { id: 'cardio', label: 'Cardio/Endurance' },
  { id: 'strength', label: 'Strength & Conditioning' },
  { id: 'speed', label: 'Speed & Agility' },
  { id: 'defense', label: 'Defensive Movement' },
];

// Define fight preparation insight types
interface InsightSection {
  title: string;
  content: string;
  icon: React.ReactNode;
}

interface FightPreparationInsights {
  opponentAnalysis: InsightSection;
  gameplanRecommendation: InsightSection;
  trainingPriorities: InsightSection;
  techniqueRecommendations: InsightSection;
  conditioningAdvice: InsightSection;
  mentalPreparation: InsightSection;
}

export default function FightPreparation() {
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [opponent, setOpponent] = useState<Fighter | null>(null);
  const [fightType, setFightType] = useState<string>('3 Round Non-Championship');
  const [fightGoal, setFightGoal] = useState<string>('');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [insights, setInsights] = useState<FightPreparationInsights | null>(null);
  
  const { toast } = useToast();
  
  const { data: fighters = [], isLoading: fightersLoading } = useQuery({
    queryKey: ['/api/fighters'],
    queryFn: getFighters,
  });

  // Handle checkbox change for focus areas
  const handleFocusAreaChange = (areaId: string, checked: boolean) => {
    setFocusAreas(prev => 
      checked 
        ? [...prev, areaId] 
        : prev.filter(id => id !== areaId)
    );
  };

  // Generate AI insights based on selected fighters and options
  const generateInsights = async () => {
    if (!fighter || !opponent) {
      toast({
        title: "Missing Information",
        description: "Please select both your fighter and the opponent",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // This would be an API call in a real application
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate personalized insights based on the fighters and options
      const generatedInsights = {
        opponentAnalysis: {
          title: "Opponent Analysis",
          icon: <Target className="h-5 w-5 text-orange-500" />,
          content: generateOpponentAnalysis(opponent, fighter),
        },
        gameplanRecommendation: {
          title: "Gameplan Recommendation",
          icon: <FileText className="h-5 w-5 text-blue-500" />,
          content: generateGameplanRecommendation(fighter, opponent, fightType),
        },
        trainingPriorities: {
          title: "Training Priorities",
          icon: <ListChecks className="h-5 w-5 text-green-500" />,
          content: generateTrainingPriorities(fighter, opponent, focusAreas),
        },
        techniqueRecommendations: {
          title: "Technique Recommendations",
          icon: <Dumbbell className="h-5 w-5 text-purple-500" />,
          content: generateTechniqueRecommendations(fighter, opponent, focusAreas),
        },
        conditioningAdvice: {
          title: "Conditioning & Peak Performance",
          icon: <Flame className="h-5 w-5 text-red-500" />,
          content: generateConditioningAdvice(fightType),
        },
        mentalPreparation: {
          title: "Mental Preparation",
          icon: <Brain className="h-5 w-5 text-indigo-500" />,
          content: generateMentalPreparation(fighter, opponent, fightGoal),
        },
      };

      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate fight preparation insights",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to generate opponent analysis
  const generateOpponentAnalysis = (opponent: Fighter, fighter: Fighter): string => {
    const strengthsAndWeaknesses = [
      `${opponent.name} is known for ${opponent.wins > opponent.losses ? 'their solid overall game' : 'being inconsistent but dangerous'}. Their record (${opponent.record}) indicates ${opponent.wins > opponent.losses ? 'a high level of skill' : 'areas that can be exploited'}.`,
      
      `Striking: ${opponent.name} ${Math.random() > 0.5 ? 'relies heavily on their striking, especially their powerful right hand' : 'has a diverse striking arsenal but tends to fade in later rounds'}.`,
      
      `Grappling: Their takedown defense ${Math.random() > 0.5 ? 'appears to be a potential weakness' : 'is quite strong, so you may need to set up takedowns carefully'}.`,
      
      `Ground game: ${opponent.name} ${Math.random() > 0.5 ? 'is vulnerable when put on their back' : 'has shown solid submission defense but can be controlled from top position'}.`,
      
      `Cardio: Their endurance ${Math.random() > 0.5 ? 'appears to diminish after round 2, which could be exploited' : 'is a strength, so preparing for a full-length fight is crucial'}.`
    ];
    
    const tendencies = [
      `${opponent.name} tends to ${Math.random() > 0.5 ? 'lead with low kicks to establish range' : 'start aggressively in the first round'}`,
      `They ${Math.random() > 0.5 ? 'often circle to their left, leaving their right side exposed' : 'frequently drop their hands after throwing combinations'}`,
      `When pressured, they typically ${Math.random() > 0.5 ? 'back straight up against the fence' : 'attempt to clinch to slow the pace'}`
    ];
    
    const recentPerformance = `In recent performances, ${opponent.name} has ${Math.random() > 0.5 ? 'shown improvements in their defensive wrestling' : 'demonstrated vulnerability to pressure fighters'}.`;
    
    return `
      ${strengthsAndWeaknesses.join(' ')}
      
      Key tendencies:
      • ${tendencies[0]}
      • ${tendencies[1]}
      • ${tendencies[2]}
      
      ${recentPerformance}
      
      Considering your skill set as ${fighter.name}, there are clear opportunities to exploit these patterns.
    `;
  };
  
  // Helper function to generate gameplan recommendation
  const generateGameplanRecommendation = (fighter: Fighter, opponent: Fighter, fightType: string): string => {
    const isChampionshipFight = fightType.includes('5 Round');
    
    const gameplanStrategies = [
      `Overall strategy: Given ${fighter.name}'s strengths and ${opponent.name}'s tendencies, a ${Math.random() > 0.5 ? 'pressure-based approach' : 'technical counter-fighting strategy'} will be most effective.`,
      
      `Round management: ${isChampionshipFight ? 'Pace yourself through the early rounds while looking for opportunities. Increase pressure in rounds 4-5 when opponent fatigue will likely be a factor.' : 'Be prepared to win each round distinctly, focusing on significant strikes and control time.'}`,
      
      `Striking approach: ${Math.random() > 0.5 ? 'Utilize your jab to maintain distance and set up power strikes when openings present themselves' : 'Work the body early to deplete their cardio, then target the head as their hands drop in later rounds'}`,
      
      `Grappling strategy: ${Math.random() > 0.5 ? 'Initiate clinch exchanges when backed near the fence to neutralize their striking and work for takedowns' : 'Time your takedown attempts during their striking entries, focusing on changing levels when they commit to heavy punches'}`,
      
      `Defensive priorities: Be particularly alert for their ${Math.random() > 0.5 ? 'overhand right and lead leg kicks' : 'level changes and clinch entries'} which have been effective in past fights.`
    ];
    
    const adaptations = [
      `If you're winning: Continue to control the center of the octagon, but don't overcommit to attacks. Maintain your lead through calculated offense.`,
      
      `If you're down on the scorecards: Increase your output and take calculated risks in the final minutes of rounds. Look for finish opportunities when they present themselves.`
    ];
    
    return `
      ${gameplanStrategies.join('\n\n')}
      
      Tactical Adaptations:
      • ${adaptations[0]}
      • ${adaptations[1]}
    `;
  };
  
  // Helper function to generate training priorities
  const generateTrainingPriorities = (fighter: Fighter, opponent: Fighter, focusAreas: string[]): string => {
    const selectedAreas = focusAreas.length > 0 
      ? focusAreas 
      : ['striking', 'wrestling', 'cardio']; // Default areas if none selected
    
    const trainingFocus: Record<string, string> = {
      striking: `Striking: Focus on ${Math.random() > 0.5 ? 'counter-striking techniques and maintaining optimal distance' : 'combination work that mixes targets between head and body'}.`,
      
      wrestling: `Wrestling: Prioritize ${Math.random() > 0.5 ? 'defensive wrestling, particularly underhooks against the fence' : 'offensive takedown entries from striking exchanges'}.`,
      
      bjj: `Brazilian Jiu-Jitsu: Emphasize ${Math.random() > 0.5 ? 'positional control and submission defense from bottom position' : 'top control and ground-and-pound opportunities'}.`,
      
      clinch: `Clinch Work: Develop ${Math.random() > 0.5 ? 'control positions against the fence with short strikes' : 'clinch entries and exits with effective strikes during transitions'}.`,
      
      cardio: `Cardio/Endurance: Structure ${Math.random() > 0.5 ? 'interval training to match the fight pace with specific focus on recovery between explosive bursts' : 'endurance work that simulates the fight duration with slightly higher output than typically needed'}.`,
      
      strength: `Strength & Conditioning: Concentrate on ${Math.random() > 0.5 ? 'explosive power development for striking effectiveness' : 'functional strength that supports grappling control'}.`,
      
      speed: `Speed & Agility: Enhance ${Math.random() > 0.5 ? 'footwork and lateral movement to exploit openings' : 'hand speed for combination striking and defensive reactions'}.`,
      
      defense: `Defensive Movement: Refine ${Math.random() > 0.5 ? 'head movement and blocking techniques specific to opponent striking patterns' : 'defensive footwork to avoid being backed against the fence'}.`,
    };
    
    const priorities = selectedAreas.map(area => trainingFocus[area]).filter(Boolean);
    
    const sparringFocus = `
      Sparring Focus:
      • Technical sparring: Simulate ${opponent.name}'s movement patterns and timing
      • Situational training: Practice specifically escaping from ${Math.random() > 0.5 ? 'fence control positions' : 'bottom position on the ground'}
      • Live rounds: Incorporate ${Math.random() > 0.5 ? 'pressure-testing your gameplan against similar body types' : 'scenario-based rounds where you start at a disadvantage'}
    `;
    
    return `
      Based on your matchup with ${opponent.name}, your training camp should prioritize the following areas:
      
      ${priorities.join('\n\n')}
      
      ${sparringFocus}
    `;
  };
  
  // Helper function to generate technique recommendations
  const generateTechniqueRecommendations = (fighter: Fighter, opponent: Fighter, focusAreas: string[]): string => {
    const offensiveTechniques = [
      `${Math.random() > 0.5 ? 'Jab-cross to lead leg kick combination' : 'Lead hook to body followed by overhand right'}`,
      `${Math.random() > 0.5 ? 'Single leg takedown against the fence' : 'Double leg entry after forcing opponent to shell up'}`,
      `${Math.random() > 0.5 ? 'Clinch control with short elbows and knees' : 'Trips and throws from body lock position'}`
    ];
    
    const defensiveTechniques = [
      `${Math.random() > 0.5 ? 'Slip-counter combinations against their straight punches' : 'Check-and-counter responses to their frequent leg kicks'}`,
      `${Math.random() > 0.5 ? 'Underhook defense against takedown attempts' : 'Sprawl-and-circle technique to avoid being controlled against the fence'}`,
      `${Math.random() > 0.5 ? 'Guard retention and scramble techniques when taken down' : 'Standing techniques to create space when clinched'}`
    ];
    
    const keyDrills = [
      `${Math.random() > 0.5 ? 'Shadow boxing with specific focus on entries and exits' : 'Partner drilling responsive counter techniques'}`,
      `${Math.random() > 0.5 ? 'Resistance band-assisted movement drills for takedown defense' : 'Chain wrestling sequences against progressively increasing resistance'}`,
      `${Math.random() > 0.5 ? 'Positional sparring starting from disadvantageous positions' : 'Technical standup repetitions with partner resistance'}`
    ];
    
    return `
      Based on your matchup with ${opponent.name}, incorporate these specific techniques into your training:
      
      Offensive Techniques:
      • ${offensiveTechniques[0]}
      • ${offensiveTechniques[1]}
      • ${offensiveTechniques[2]}
      
      Defensive Techniques:
      • ${defensiveTechniques[0]}
      • ${defensiveTechniques[1]}
      • ${defensiveTechniques[2]}
      
      Key Drilling Focus:
      • ${keyDrills[0]}
      • ${keyDrills[1]}
      • ${keyDrills[2]}
    `;
  };
  
  // Helper function to generate conditioning advice
  const generateConditioningAdvice = (fightType: string): string => {
    const isChampionshipFight = fightType.includes('5 Round');
    
    const weeklyStructure = `
      8-Week Camp Structure:
      • Weeks 1-2: Focus on building ${Math.random() > 0.5 ? 'baseline conditioning while gradually increasing technical work' : 'strength foundation while introducing fight-specific drills'}
      • Weeks 3-5: Emphasize ${Math.random() > 0.5 ? 'technical refinement with increased sparring intensity' : 'sport-specific conditioning with situational training'}
      • Weeks 6-7: ${Math.random() > 0.5 ? 'Peak conditioning with fight simulation and recovery protocols' : 'Technical mastery with full intensity but reduced volume'}
      • Week 8: Tapering phase with ${Math.random() > 0.5 ? 'focus on weight management and mental preparation' : 'maintenance workouts and recovery optimization'}
    `;
    
    const energySystemWork = `
      Energy System Development:
      • Aerobic base: ${isChampionshipFight ? '60-75 minute steady-state sessions 2x weekly' : '45-60 minute steady-state sessions 2x weekly'} 
      • Anaerobic capacity: ${Math.random() > 0.5 ? 'High-intensity intervals (30s work/30s rest) for 15-20 minutes' : 'Tabata protocols (20s work/10s rest) for 4-8 minutes'}
      • Alactic power: ${Math.random() > 0.5 ? 'Explosive 6-10 second bursts with full recovery' : 'Complex training combining strength movements with explosive techniques'}
    `;
    
    const recoveryProtocols = `
      Recovery Protocols:
      • Implement contrast therapy (hot/cold) ${Math.random() > 0.5 ? 'after high-intensity training days' : 'twice weekly regardless of training intensity'}
      • Ensure ${isChampionshipFight ? '8-9 hours' : '7-8 hours'} of quality sleep with consistent sleep/wake times
      • Schedule ${Math.random() > 0.5 ? 'active recovery sessions (light movement, mobility)' : 'complete rest days'} every 3-4 days of intense training
      • Nutrition timing to prioritize ${Math.random() > 0.5 ? 'recovery with emphasis on post-workout refueling' : 'performance with pre-workout optimization'}
    `;
    
    return `
      For your ${fightType} fight, follow this conditioning and peaking strategy:
      
      ${weeklyStructure}
      
      ${energySystemWork}
      
      ${recoveryProtocols}
    `;
  };
  
  // Helper function to generate mental preparation advice
  const generateMentalPreparation = (fighter: Fighter, opponent: Fighter, fightGoal: string): string => {
    const goal = fightGoal || `defeating ${opponent.name} convincingly`;
    
    const visualizationPractices = `
      Visualization Protocol:
      • Daily 10-minute session visualizing ${Math.random() > 0.5 ? 'successful execution of your gameplan' : 'overcoming adversity in the fight'}
      • Focus on ${Math.random() > 0.5 ? 'sensory details including the sounds, feelings, and environment' : 'emotional control during key fight moments'}
      • Incorporate ${Math.random() > 0.5 ? 'both process visualization (techniques) and outcome visualization (victory)' : 'visualization of recovery between rounds and tactical adjustments'}
    `;
    
    const confidenceBuilding = `
      Confidence Development:
      • Review footage of ${Math.random() > 0.5 ? 'your past successful performances' : `opponents similar to ${opponent.name} that you have defeated`}
      • Create a ${Math.random() > 0.5 ? 'personal highlight reel of your best techniques and moments' : 'list of your most reliable techniques that consistently work under pressure'}
      • Document training progress with ${Math.random() > 0.5 ? 'measurable improvements in specific areas' : 'video analysis of sparring rounds showing improvement'}
    `;
    
    const pressureManagement = `
      Fight Week Management:
      • Establish clear ${Math.random() > 0.5 ? 'fight week routines for predictability and comfort' : 'media and weight cutting protocols to minimize stress'}
      • Prepare ${Math.random() > 0.5 ? 'specific responses for pre-fight mind games or trash talk' : 'mental triggers to maintain focus during face-offs and introductions'}
      • Implement ${Math.random() > 0.5 ? 'brief meditation practices to center yourself before warming up' : 'breathing techniques to regulate arousal levels before walking out'}
    `;
    
    return `
      Mental Preparation to achieve your goal of ${goal}:
      
      ${visualizationPractices}
      
      ${confidenceBuilding}
      
      ${pressureManagement}
    `;
  };

  // Render insight section
  const renderInsightSection = (section: InsightSection) => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            {section.icon}
            <span className="ml-2">{section.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-line text-gray-700">
            {section.content}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
        AI Fight Preparation Insights
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Generate personalized training plans and fight strategy based on opponent analysis
      </p>

      {!insights ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Fighter Information</CardTitle>
              <CardDescription>Select fighters and fight details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Fighter</h3>
                <FighterSearch 
                  fighters={fighters} 
                  isLoading={fightersLoading} 
                  onSelect={setFighter}
                />
                {fighter && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {fighter.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{fighter.name}</p>
                      <p className="text-xs text-gray-500">{fighter.division} • {fighter.record}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Opponent</h3>
                <FighterSearch 
                  fighters={fighters} 
                  isLoading={fightersLoading} 
                  onSelect={setOpponent}
                />
                {opponent && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                      {opponent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{opponent.name}</p>
                      <p className="text-xs text-gray-500">{opponent.division} • {opponent.record}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="fightType">Fight Type</Label>
                <Select 
                  value={fightType} 
                  onValueChange={setFightType}
                >
                  <SelectTrigger id="fightType" className="w-full">
                    <SelectValue placeholder="Select fight type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 Round Non-Championship">3 Round Non-Championship</SelectItem>
                    <SelectItem value="5 Round Main Event">5 Round Main Event</SelectItem>
                    <SelectItem value="5 Round Championship">5 Round Championship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Preferences</CardTitle>
              <CardDescription>Customize your fight preparation plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="fightGoal">Your Goal for This Fight</Label>
                <Textarea 
                  id="fightGoal"
                  placeholder="e.g., Dominant victory, Title defense, Improving ranking..."
                  value={fightGoal}
                  onChange={(e) => setFightGoal(e.target.value)}
                  className="h-20"
                />
              </div>

              <div>
                <Label className="mb-2 block">
                  Training Focus Areas (select all that apply)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {trainingFocusAreas.map((area) => (
                    <div key={area.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={area.id} 
                        checked={focusAreas.includes(area.id)}
                        onCheckedChange={(checked) => handleFocusAreaChange(area.id, checked === true)}
                      />
                      <Label htmlFor={area.id} className="text-sm font-normal cursor-pointer">
                        {area.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isGenerating || !fighter || !opponent}
                onClick={generateInsights}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Insights...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Fight Preparation Plan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center">
              <Shield className="mr-2 h-6 w-6 text-primary" />
              Fight Preparation: {fighter?.name} vs {opponent?.name}
            </h2>
            <Button 
              variant="outline" 
              onClick={() => setInsights(null)}
            >
              Create New Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {renderInsightSection(insights.opponentAnalysis)}
              {renderInsightSection(insights.gameplanRecommendation)}
              {renderInsightSection(insights.trainingPriorities)}
            </div>
            <div>
              {renderInsightSection(insights.techniqueRecommendations)}
              {renderInsightSection(insights.conditioningAdvice)}
              {renderInsightSection(insights.mentalPreparation)}
            </div>
          </div>

          <Card className="mt-8 bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-500" />
                About This Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>
                This fight preparation plan is generated based on available fighter data and modern MMA training principles. 
                The analysis considers the specific matchup dynamics between {fighter?.name} and {opponent?.name}.
              </p>
              <p>
                For best results, review this plan with your coaching team to integrate these insights 
                with their expertise and your existing training framework.
              </p>
              <p>
                Training camps typically last 8-10 weeks. Begin implementing these recommendations as early as possible 
                while allowing sufficient time for technical mastery and proper peaking.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}