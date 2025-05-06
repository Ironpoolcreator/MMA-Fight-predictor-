import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedFight, getFighters } from '@/lib/api';
import { Fighter } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Scale, AlertCircle, ThumbsUp, ThumbsDown, Percent, TrendingUp, Info } from 'lucide-react';
import { generatePrediction } from '@/lib/predictionModel';
import FighterSearch from '@/components/FighterSearch';
import { useToast } from '@/hooks/use-toast';

interface Odds {
  fighter1Odds: number;
  fighter2Odds: number;
  fighter1DecimalOdds: number;
  fighter2DecimalOdds: number;
  fighter1ImpliedProbability: number;
  fighter2ImpliedProbability: number;
  overUnder: {
    rounds: number;
    over: {
      odds: number;
      decimalOdds: number;
    };
    under: {
      odds: number;
      decimalOdds: number;
    };
  };
}

function convertOdds(moneylineOdds: number): number {
  return moneylineOdds > 0 
    ? (moneylineOdds / 100) + 1 
    : (100 / Math.abs(moneylineOdds)) + 1;
}

function calculateImpliedProbability(moneylineOdds: number): number {
  const decimalOdds = convertOdds(moneylineOdds);
  return +(100 / decimalOdds).toFixed(2);
}

function generateRandomOdds(favoredFighter: 1 | 2, winProbability: number): Odds {
  // Generate realistic odds based on the win probability
  const edgePercentage = 5; // Bookmaker's edge
  
  // Adjust probabilities to include the bookmaker's edge
  const f1Probability = favoredFighter === 1 
    ? winProbability 
    : 100 - winProbability;
  
  const f2Probability = favoredFighter === 2
    ? winProbability
    : 100 - winProbability;
  
  // Calculate the implied probabilities with the bookmaker's edge
  const f1ImpliedProb = Math.min(f1Probability + (f1Probability * edgePercentage / 100), 95);
  const f2ImpliedProb = Math.min(f2Probability + (f2Probability * edgePercentage / 100), 95);
  
  // Convert probabilities to decimal odds
  const f1DecimalOdds = +(100 / f1ImpliedProb).toFixed(2);
  const f2DecimalOdds = +(100 / f2ImpliedProb).toFixed(2);
  
  // Convert decimal odds to moneyline odds
  const f1Odds = f1DecimalOdds >= 2 
    ? Math.round((f1DecimalOdds - 1) * 100) 
    : Math.round(-100 / (f1DecimalOdds - 1));
  
  const f2Odds = f2DecimalOdds >= 2 
    ? Math.round((f2DecimalOdds - 1) * 100) 
    : Math.round(-100 / (f2DecimalOdds - 1));
  
  // Generate over/under rounds
  const rounds = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5 rounds
  const overUnderJuice = Math.random() > 0.5 ? -110 : -120;
  
  return {
    fighter1Odds: f1Odds,
    fighter2Odds: f2Odds,
    fighter1DecimalOdds: f1DecimalOdds,
    fighter2DecimalOdds: f2DecimalOdds,
    fighter1ImpliedProbability: f1ImpliedProb,
    fighter2ImpliedProbability: f2ImpliedProb,
    overUnder: {
      rounds: rounds - 0.5, // Use x.5 rounds format
      over: {
        odds: overUnderJuice,
        decimalOdds: convertOdds(overUnderJuice)
      },
      under: {
        odds: overUnderJuice,
        decimalOdds: convertOdds(overUnderJuice)
      }
    }
  };
}

export default function BettingOdds() {
  const [selectedFighter1, setSelectedFighter1] = useState<Fighter | null>(null);
  const [selectedFighter2, setSelectedFighter2] = useState<Fighter | null>(null);
  const [customPrediction, setCustomPrediction] = useState<any | null>(null);
  const [customOdds, setCustomOdds] = useState<Odds | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const { toast } = useToast();

  const { data: featuredFight, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/featured-fight'],
    queryFn: getFeaturedFight,
  });

  const { data: fighters = [], isLoading: fightersLoading } = useQuery({
    queryKey: ['/api/fighters'],
    queryFn: getFighters,
  });

  // Generate random odds for the featured fight
  const featuredOdds: Odds | null = featuredFight ? generateRandomOdds(
    featuredFight.fighter1WinProbability > featuredFight.fighter2WinProbability ? 1 : 2,
    Math.max(featuredFight.fighter1WinProbability, featuredFight.fighter2WinProbability)
  ) : null;

  // Calculate the edge between AI prediction and betting odds
  const calculateEdge = (aiProbability: number, bettingProbability: number) => {
    return +(aiProbability - bettingProbability).toFixed(2);
  };

  const getBetRecommendation = (edge: number) => {
    if (edge > 10) return { recommendation: "Strong Value", color: "text-green-600" };
    if (edge > 5) return { recommendation: "Good Value", color: "text-green-500" };
    if (edge > 2) return { recommendation: "Slight Value", color: "text-blue-500" };
    if (edge > -2) return { recommendation: "Fair Odds", color: "text-gray-500" };
    if (edge > -5) return { recommendation: "Slightly Overpriced", color: "text-yellow-500" };
    if (edge > -10) return { recommendation: "Overpriced", color: "text-orange-500" };
    return { recommendation: "Poor Value", color: "text-red-600" };
  };

  const handleGenerateCustom = async () => {
    if (!selectedFighter1 || !selectedFighter2) {
      toast({
        title: "Fighters Required",
        description: "Please select both fighters to generate odds",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const prediction = await generatePrediction(selectedFighter1, selectedFighter2, {
        fightType: 'Professional',
        weightClass: selectedFighter1.division,
        venueType: 'Arena'
      });
      
      setCustomPrediction(prediction);
      
      const odds = generateRandomOdds(
        prediction.fighter1WinProbability > prediction.fighter2WinProbability ? 1 : 2,
        Math.max(prediction.fighter1WinProbability, prediction.fighter2WinProbability)
      );
      
      setCustomOdds(odds);
    } catch (error) {
      console.error('Error generating prediction and odds:', error);
      toast({
        title: "Error",
        description: "Failed to generate prediction and odds",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const renderFeaturedFightSection = () => {
    if (featuredLoading) {
      return (
        <div className="text-center py-10">
          <div className="animate-pulse h-6 w-40 bg-gray-200 rounded mx-auto mb-2"></div>
          <div className="animate-pulse h-4 w-60 bg-gray-200 rounded mx-auto"></div>
        </div>
      );
    }

    if (!featuredFight || !featuredOdds) return null;

    const fighter1Edge = calculateEdge(
      featuredFight.fighter1WinProbability,
      featuredOdds.fighter1ImpliedProbability
    );
    
    const fighter2Edge = calculateEdge(
      featuredFight.fighter2WinProbability, 
      featuredOdds.fighter2ImpliedProbability
    );

    const fighter1Recommendation = getBetRecommendation(fighter1Edge);
    const fighter2Recommendation = getBetRecommendation(fighter2Edge);

    return (
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <CardTitle className="text-xl md:text-2xl">{featuredFight.eventName}</CardTitle>
          <CardDescription className="text-gray-300">
            {featuredFight.eventDate} • Main Event
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                  {getInitials(featuredFight.fighter1.name)}
                </div>
                <div>
                  <h3 className="font-bold">{featuredFight.fighter1.name}</h3>
                  <p className="text-sm text-gray-500">{featuredFight.fighter1.record}</p>
                </div>
              </div>
              
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Betting Odds</p>
                      <p className="text-xl font-bold">{formatOdds(featuredOdds.fighter1Odds)}</p>
                      <p className="text-xs text-gray-500">Implied Prob: {featuredOdds.fighter1ImpliedProbability}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">AI Prediction</p>
                      <p className="text-xl font-bold">{featuredFight.fighter1WinProbability}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-3 text-sm font-medium">
                    {fighter1Edge > 0 ? (
                      <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                    ) : (
                      <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                    )}
                    <div className={fighter1Recommendation.color}>
                      {fighter1Recommendation.recommendation} 
                      <span className="ml-1">({fighter1Edge > 0 ? "+" : ""}{fighter1Edge}%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-semibold mb-2">VS</p>
              <Card className="w-full bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    TOTAL ROUNDS
                  </h4>
                  <p className="text-lg font-bold">
                    {featuredOdds.overUnder.rounds}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-gray-500">OVER</p>
                      <p className="font-medium">
                        {formatOdds(featuredOdds.overUnder.over.odds)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">UNDER</p>
                      <p className="font-medium">
                        {formatOdds(featuredOdds.overUnder.under.odds)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="w-full mt-3 bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Scale className="h-4 w-4 mr-2 text-primary" />
                      <p className="text-sm font-medium">Fight Analysis</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Percent className="h-3 w-3 mr-1" />
                      Confidence: {featuredFight.confidenceScore}%
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                    {featuredFight.analysis}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-lg font-bold">
                  {getInitials(featuredFight.fighter2.name)}
                </div>
                <div>
                  <h3 className="font-bold">{featuredFight.fighter2.name}</h3>
                  <p className="text-sm text-gray-500">{featuredFight.fighter2.record}</p>
                </div>
              </div>
              
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Betting Odds</p>
                      <p className="text-xl font-bold">{formatOdds(featuredOdds.fighter2Odds)}</p>
                      <p className="text-xs text-gray-500">Implied Prob: {featuredOdds.fighter2ImpliedProbability}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">AI Prediction</p>
                      <p className="text-xl font-bold">{featuredFight.fighter2WinProbability}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-3 text-sm font-medium">
                    {fighter2Edge > 0 ? (
                      <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                    ) : (
                      <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                    )}
                    <div className={fighter2Recommendation.color}>
                      {fighter2Recommendation.recommendation}
                      <span className="ml-1">({fighter2Edge > 0 ? "+" : ""}{fighter2Edge}%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-100 py-3 px-6">
          <div className="w-full flex items-center justify-between">
            <p className="text-xs text-gray-500 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Odds are for information purposes only. Not gambling advice.
            </p>
            <p className="text-xs text-gray-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const renderCustomOddsSection = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Select Fighter 1</h3>
            <FighterSearch
              fighters={fighters}
              isLoading={fightersLoading}
              onSelect={setSelectedFighter1}
            />
            
            {selectedFighter1 && (
              <div className="flex items-center gap-3 mt-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {getInitials(selectedFighter1.name)}
                </div>
                <div>
                  <p className="font-medium">{selectedFighter1.name}</p>
                  <p className="text-xs text-gray-500">{selectedFighter1.division} • {selectedFighter1.record}</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Select Fighter 2</h3>
            <FighterSearch
              fighters={fighters}
              isLoading={fightersLoading}
              onSelect={setSelectedFighter2}
            />
            
            {selectedFighter2 && (
              <div className="flex items-center gap-3 mt-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                  {getInitials(selectedFighter2.name)}
                </div>
                <div>
                  <p className="font-medium">{selectedFighter2.name}</p>
                  <p className="text-xs text-gray-500">{selectedFighter2.division} • {selectedFighter2.record}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90"
            onClick={handleGenerateCustom}
            disabled={!selectedFighter1 || !selectedFighter2 || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Odds & Predictions'}
          </Button>
        </div>
        
        {customPrediction && customOdds && (
          <div className="animate-fadeIn">
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <CardTitle className="text-xl">Custom Fight Analysis</CardTitle>
                <CardDescription className="text-gray-300">
                  {selectedFighter1?.name} vs {selectedFighter2?.name}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                        {getInitials(selectedFighter1?.name || '')}
                      </div>
                      <div>
                        <h3 className="font-bold">{selectedFighter1?.name}</h3>
                        <p className="text-sm text-gray-500">{selectedFighter1?.record}</p>
                      </div>
                    </div>
                    
                    <Card className="bg-gray-50 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Betting Odds</p>
                            <p className="text-xl font-bold">{formatOdds(customOdds.fighter1Odds)}</p>
                            <p className="text-xs text-gray-500">Implied Prob: {customOdds.fighter1ImpliedProbability}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">AI Prediction</p>
                            <p className="text-xl font-bold">{customPrediction.fighter1WinProbability}%</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-3 text-sm font-medium">
                          {calculateEdge(customPrediction.fighter1WinProbability, customOdds.fighter1ImpliedProbability) > 0 ? (
                            <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                          ) : (
                            <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                          )}
                          <div className={getBetRecommendation(calculateEdge(customPrediction.fighter1WinProbability, customOdds.fighter1ImpliedProbability)).color}>
                            {getBetRecommendation(calculateEdge(customPrediction.fighter1WinProbability, customOdds.fighter1ImpliedProbability)).recommendation}
                            <span className="ml-1">({calculateEdge(customPrediction.fighter1WinProbability, customOdds.fighter1ImpliedProbability) > 0 ? "+" : ""}
                              {calculateEdge(customPrediction.fighter1WinProbability, customOdds.fighter1ImpliedProbability)}%)
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold mb-2">VS</p>
                    <Card className="w-full bg-gray-50 border-gray-200">
                      <CardContent className="p-4">
                        <h4 className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                          <Info className="h-4 w-4 mr-1" />
                          TOTAL ROUNDS
                        </h4>
                        <p className="text-lg font-bold">
                          {customOdds.overUnder.rounds}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">OVER</p>
                            <p className="font-medium">
                              {formatOdds(customOdds.overUnder.over.odds)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">UNDER</p>
                            <p className="font-medium">
                              {formatOdds(customOdds.overUnder.under.odds)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="w-full mt-3 bg-gray-50 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Scale className="h-4 w-4 mr-2 text-primary" />
                            <p className="text-sm font-medium">Fight Analysis</p>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Percent className="h-3 w-3 mr-1" />
                            Confidence: {customPrediction.confidenceScore}%
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                          {customPrediction.analysis}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-lg font-bold">
                        {getInitials(selectedFighter2?.name || '')}
                      </div>
                      <div>
                        <h3 className="font-bold">{selectedFighter2?.name}</h3>
                        <p className="text-sm text-gray-500">{selectedFighter2?.record}</p>
                      </div>
                    </div>
                    
                    <Card className="bg-gray-50 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Betting Odds</p>
                            <p className="text-xl font-bold">{formatOdds(customOdds.fighter2Odds)}</p>
                            <p className="text-xs text-gray-500">Implied Prob: {customOdds.fighter2ImpliedProbability}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">AI Prediction</p>
                            <p className="text-xl font-bold">{customPrediction.fighter2WinProbability}%</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-3 text-sm font-medium">
                          {calculateEdge(customPrediction.fighter2WinProbability, customOdds.fighter2ImpliedProbability) > 0 ? (
                            <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                          ) : (
                            <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                          )}
                          <div className={getBetRecommendation(calculateEdge(customPrediction.fighter2WinProbability, customOdds.fighter2ImpliedProbability)).color}>
                            {getBetRecommendation(calculateEdge(customPrediction.fighter2WinProbability, customOdds.fighter2ImpliedProbability)).recommendation}
                            <span className="ml-1">({calculateEdge(customPrediction.fighter2WinProbability, customOdds.fighter2ImpliedProbability) > 0 ? "+" : ""}
                              {calculateEdge(customPrediction.fighter2WinProbability, customOdds.fighter2ImpliedProbability)}%)
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-100 py-3 px-6">
                <div className="w-full flex items-center justify-between">
                  <p className="text-xs text-gray-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Odds are for information purposes only. Not gambling advice.
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Generated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
        Betting Odds Analysis
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Compare AI predictions with real-world betting odds to identify value
      </p>

      <Tabs defaultValue="featured" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="featured" className="text-base py-3">Featured Fight</TabsTrigger>
          <TabsTrigger value="custom" className="text-base py-3">Custom Fight</TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured" className="mt-0">
          {renderFeaturedFightSection()}
        </TabsContent>
        
        <TabsContent value="custom" className="mt-0">
          {renderCustomOddsSection()}
        </TabsContent>
      </Tabs>
      
      <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <Info className="mr-2 h-5 w-5 text-primary" />
          Understanding the Betting Odds
        </h2>
        
        <p className="text-gray-700 mb-4">
          Betting odds can be displayed in different formats. Our tool uses American (Moneyline) odds.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">American (Moneyline) Odds</h3>
            <p className="text-sm text-gray-600">
              <strong>Positive (+) numbers</strong> show how much profit you would win on a $100 bet.
              <br /><br />
              <strong>Negative (-) numbers</strong> show how much you need to bet to win $100 profit.
            </p>
          </div>
          
          <div className="p-4 bg-white rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Implied Probability</h3>
            <p className="text-sm text-gray-600">
              Represents the probability of an outcome as implied by the odds. This includes the bookmaker's margin, which makes the combined probabilities exceed 100%.
            </p>
          </div>
          
          <div className="p-4 bg-white rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Betting Value</h3>
            <p className="text-sm text-gray-600">
              When our AI prediction gives a fighter a higher win probability than the implied odds suggest, there may be betting value. The larger the gap, the better the potential value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}