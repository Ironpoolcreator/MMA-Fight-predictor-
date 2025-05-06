import { useMemo } from "react";
import FighterSearch from "@/components/FighterSearch";
import FeaturedFight from "@/components/FeaturedFight";
import PredictionTool from "@/components/PredictionTool";
import WeightClassSection from "@/components/WeightClassSection";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getFighters } from "@/lib/api";
import { Dumbbell, BarChart } from "lucide-react";
import type { Fighter } from "@/types";

// Define weight classes in order from lightest to heaviest
const WEIGHT_CLASSES = [
  "Flyweight",
  "Bantamweight", 
  "Featherweight", 
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Light Heavyweight",
  "Heavyweight",
  "Women's Strawweight",
  "Women's Flyweight",
  "Women's Bantamweight",
  "Women's Featherweight"
];

export default function Home() {
  const [, navigate] = useLocation();
  
  const { data: fighters, isLoading } = useQuery({ 
    queryKey: ['/api/fighters'],
    queryFn: getFighters
  });

  // Group fighters by weight class
  const fightersByWeightClass = useMemo(() => {
    if (!fighters) return {};
    
    return fighters.reduce((acc: Record<string, Fighter[]>, fighter) => {
      if (!acc[fighter.division]) {
        acc[fighter.division] = [];
      }
      acc[fighter.division].push(fighter);
      return acc;
    }, {});
  }, [fighters]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-zinc-900 relative overflow-hidden border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              <span className="text-accent">AI-POWERED</span> MMA FIGHT PREDICTIONS
            </h1>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl">
              Get data-driven predictions for upcoming fights, explore fighter stats, and analyze matchups with our advanced AI system.
            </p>
            
            <FighterSearch isLoading={isLoading} fighters={fighters || []} />
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Button 
                className="ufc-button bg-primary hover:bg-primary/90"
                onClick={() => navigate('/prediction')}
              >
                <Dumbbell className="mr-2 h-5 w-5" />
                Predict Next Fight
              </Button>
              <Button 
                variant="outline" 
                className="ufc-button bg-zinc-800 hover:bg-zinc-700 border-none"
                onClick={() => navigate('/rankings')}
              >
                <BarChart className="mr-2 h-5 w-5" />
                Explore Fighter Stats
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fight Prediction */}
      <FeaturedFight />
      
      {/* Fighter Listings by Weight Class */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 uppercase tracking-wider">Fighters by Weight Class</h2>
        
        {!isLoading && fighters ? (
          WEIGHT_CLASSES.map(weightClass => {
            const weightClassFighters = fightersByWeightClass[weightClass] || [];
            return weightClassFighters.length > 0 ? (
              <WeightClassSection 
                key={weightClass} 
                title={weightClass}
                fighters={weightClassFighters}
              />
            ) : null;
          })
        ) : (
          <div className="text-center py-12">
            <div className="animate-pulse flex space-x-4 justify-center">
              <div className="rounded-full bg-zinc-800 h-12 w-12"></div>
              <div className="flex-1 space-y-4 max-w-lg">
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-800 rounded"></div>
                  <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-zinc-400">Loading fighters...</p>
          </div>
        )}
      </section>
      
      {/* Prediction Tool */}
      <PredictionTool />
    </div>
  );
}
