import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFighters } from "@/lib/api";
import { generatePrediction } from "@/lib/predictionModel";
import StatComparison from "@/components/StatComparison";
import AIPredictionResults from "@/components/AIPredictionResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RocketIcon } from "lucide-react";
import { Fighter, FightPrediction } from "@/types";

const WEIGHT_CLASSES = [
  "Heavyweight",
  "Light Heavyweight",
  "Middleweight",
  "Welterweight",
  "Lightweight",
  "Featherweight",
  "Bantamweight",
  "Flyweight",
];

const FIGHT_TYPES = [
  "5 Round Championship",
  "5 Round Main Event",
  "3 Round Non-Title",
];

const VENUE_TYPES = [
  "UFC Apex",
  "Large Arena",
  "International Event",
  "Fight Island",
];

export default function Prediction() {
  const [fighter1Id, setFighter1Id] = useState<string>("");
  const [fighter2Id, setFighter2Id] = useState<string>("");
  const [fightType, setFightType] = useState<string>("5 Round Championship");
  const [weightClass, setWeightClass] = useState<string>("Heavyweight");
  const [venueType, setVenueType] = useState<string>("Large Arena");
  const [prediction, setPrediction] = useState<FightPrediction | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: fighters, isLoading } = useQuery({
    queryKey: ["/api/fighters"],
    queryFn: getFighters,
  });

  const handleGeneratePrediction = async () => {
    if (!fighter1Id || !fighter2Id) return;

    setIsGenerating(true);
    
    try {
      const fighter1 = fighters?.find(f => f.id.toString() === fighter1Id);
      const fighter2 = fighters?.find(f => f.id.toString() === fighter2Id);
      
      if (!fighter1 || !fighter2) throw new Error("Fighter not found");
      
      // Don't allow fights between different weight classes
      if (fighter1.division !== fighter2.division) {
        alert("Fighters must be from the same weight class.");
        setIsGenerating(false);
        return;
      }
      
      const predictionResult = await generatePrediction(
        fighter1, 
        fighter2, 
        { fightType, weightClass, venueType }
      );
      
      setPrediction(predictionResult);
    } catch (error) {
      console.error("Error generating prediction:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-10 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Create Your Own Fight Prediction
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mt-2">
            Select two fighters to get AI-powered match predictions and detailed analysis
          </p>
        </div>

        <Card className="bg-zinc-800 border-zinc-700 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
              {/* Fighter 1 Selector */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Select First Fighter
                </label>
                <Select
                  value={fighter1Id}
                  onValueChange={setFighter1Id}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue placeholder="Select a fighter..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    {!isLoading && fighters && fighters.map((fighter) => (
                      <SelectItem 
                        key={fighter.id}
                        value={fighter.id.toString()}
                        className="hover:bg-zinc-700"
                      >
                        {fighter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* VS */}
              <div className="md:col-span-1 flex items-center justify-center">
                <div className="text-zinc-500 text-lg font-bold">VS</div>
              </div>

              {/* Fighter 2 Selector */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Select Second Fighter
                </label>
                <Select 
                  value={fighter2Id}
                  onValueChange={setFighter2Id}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue placeholder="Select a fighter..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    {!isLoading && fighters && fighters.map((fighter) => (
                      <SelectItem 
                        key={fighter.id}
                        value={fighter.id.toString()}
                        className="hover:bg-zinc-700"
                      >
                        {fighter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Fight Type
                </label>
                <Select value={fightType} onValueChange={setFightType}>
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    {FIGHT_TYPES.map((type) => (
                      <SelectItem 
                        key={type}
                        value={type}
                        className="hover:bg-zinc-700"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Weight Class
                </label>
                <Select value={weightClass} onValueChange={setWeightClass}>
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    {WEIGHT_CLASSES.map((wc) => (
                      <SelectItem 
                        key={wc}
                        value={wc}
                        className="hover:bg-zinc-700"
                      >
                        {wc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Venue Type
                </label>
                <Select value={venueType} onValueChange={setVenueType}>
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    {VENUE_TYPES.map((venue) => (
                      <SelectItem 
                        key={venue}
                        value={venue}
                        className="hover:bg-zinc-700"
                      >
                        {venue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-zinc-200 text-black font-bold px-8 shadow-md"
                onClick={handleGeneratePrediction}
                disabled={!fighter1Id || !fighter2Id || isGenerating}
              >
                <RocketIcon className="mr-2 h-5 w-5" />
                {isGenerating ? "Generating..." : "Generate Prediction"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prediction Results */}
        {prediction && (
          <div className="mt-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Fight Prediction Results</h3>
            
            {/* Side-by-side fighter image and details */}
            <Card className="bg-zinc-800 border-zinc-700 shadow-lg overflow-hidden mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
                  {/* Fighter 1 */}
                  <div className="md:col-span-3 flex flex-col items-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full border-4 border-zinc-700 overflow-hidden bg-zinc-900 flex items-center justify-center">
                        {prediction.fighter1.image ? (
                          <img 
                            src={prediction.fighter1.image} 
                            alt={prediction.fighter1.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl">👤</span>
                        )}
                      </div>
                      <div className={`absolute -bottom-2 -right-2 ${prediction.fighter1WinProbability > 50 ? 'bg-white' : 'bg-zinc-700'} text-black text-xs px-2 py-1 rounded-full font-semibold`}>
                        {prediction.fighter1.record}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mt-4 text-white">{prediction.fighter1.name}</h3>
                    <p className="text-zinc-400">
                      {prediction.fighter1.isChampion ? `${prediction.fighter1.division} Champion` : prediction.fighter1.division}
                    </p>
                    <div className={`mt-4 flex items-center justify-center rounded-full ${prediction.fighter1WinProbability > 50 ? 'bg-white bg-opacity-20' : 'bg-zinc-700 bg-opacity-20'} px-4 py-2`}>
                      <span className={`text-lg mr-1 font-bold ${prediction.fighter1WinProbability > 50 ? 'text-white' : 'text-zinc-300'}`}>
                        {prediction.fighter1WinProbability}%
                      </span>
                      <span className="text-sm text-zinc-300">Win Probability</span>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="md:col-span-1 flex flex-col items-center justify-center">
                    <div className="text-zinc-500 text-2xl font-bold">VS</div>
                    <div className="mt-4 bg-zinc-900 rounded-lg p-3 text-center">
                      <p className="text-xs text-zinc-400">Prediction Confidence</p>
                      <p className="text-lg font-bold text-white">{prediction.confidenceScore}%</p>
                    </div>
                  </div>

                  {/* Fighter 2 */}
                  <div className="md:col-span-3 flex flex-col items-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full border-4 border-zinc-700 overflow-hidden bg-zinc-900 flex items-center justify-center">
                        {prediction.fighter2.image ? (
                          <img 
                            src={prediction.fighter2.image} 
                            alt={prediction.fighter2.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl">👤</span>
                        )}
                      </div>
                      <div className={`absolute -bottom-2 -right-2 ${prediction.fighter1WinProbability < 50 ? 'bg-white' : 'bg-zinc-700'} text-black text-xs px-2 py-1 rounded-full font-semibold`}>
                        {prediction.fighter2.record}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mt-4 text-white">{prediction.fighter2.name}</h3>
                    <p className="text-zinc-400">
                      {prediction.fighter2.isChampion ? `${prediction.fighter2.division} Champion` : prediction.fighter2.division}
                    </p>
                    <div className={`mt-4 flex items-center justify-center rounded-full ${prediction.fighter1WinProbability < 50 ? 'bg-white bg-opacity-20' : 'bg-zinc-700 bg-opacity-20'} px-4 py-2`}>
                      <span className={`text-lg mr-1 font-bold ${prediction.fighter1WinProbability < 50 ? 'text-white' : 'text-zinc-300'}`}>
                        {prediction.fighter2WinProbability}%
                      </span>
                      <span className="text-sm text-zinc-300">Win Probability</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stat Comparison */}
            <div className="mb-8">
              <StatComparison 
                fighter1={prediction.fighter1}
                fighter2={prediction.fighter2}
                stats={prediction.comparisonStats}
              />
            </div>
            
            {/* Advanced AI Prediction Results */}
            <AIPredictionResults prediction={prediction} />
          </div>
        )}
      </div>
    </section>
  );
}