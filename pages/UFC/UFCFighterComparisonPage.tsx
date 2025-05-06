import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Fighter } from '../../types';
import UFCNavbar from '../../components/UFC/UFCNavbar';
import WeightCategorySelector, { weightCategories } from '../../components/UFC/WeightCategorySelector';
import UFCFighterSelector from '../../components/UFC/UFCFighterSelector';
import FighterComparisonUFC from '../../components/UFC/FighterComparisonUFC';

export default function UFCFighterComparisonPage() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [selectedWeightCategory, setSelectedWeightCategory] = useState('welterweight');
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fighter1, setFighter1] = useState<Fighter | null>(null);
  const [fighter2, setFighter2] = useState<Fighter | null>(null);
  const [latestComparisons, setLatestComparisons] = useState<any[]>([]);
  
  // Parse query parameters for pre-selected fighters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fighter1Id = searchParams.get('fighter1');
    const fighter2Id = searchParams.get('fighter2');
    
    if (fighter1Id || fighter2Id) {
      setIsLoading(true);
      
      // Fetch fighters data if not already loaded
      if (fighters.length === 0) {
        fetchFighters().then(() => {
          loadFightersFromParams(fighter1Id, fighter2Id);
        });
      } else {
        loadFightersFromParams(fighter1Id, fighter2Id);
      }
    }
  }, [location]);
  
  // Helper function to load fighters from URL parameters
  const loadFightersFromParams = (fighter1Id: string | null, fighter2Id: string | null) => {
    if (fighter1Id) {
      const fighter = fighters.find(f => f.id === parseInt(fighter1Id));
      if (fighter) {
        setFighter1(fighter);
        // Set weight category based on fighter 1
        const category = weightCategories.find(c => c.name.toLowerCase().includes(fighter.division.toLowerCase()));
        if (category) {
          setSelectedWeightCategory(category.id);
        }
      }
    }
    
    if (fighter2Id) {
      const fighter = fighters.find(f => f.id === parseInt(fighter2Id));
      if (fighter) {
        setFighter2(fighter);
      }
    }
    
    setIsLoading(false);
  };
  
  // Fetch fighters data
  useEffect(() => {
    fetchFighters();
    fetchLatestComparisons();
  }, []);
  
  const fetchFighters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/fighters');
      if (response.ok) {
        const data = await response.json();
        setFighters(data);
      } else {
        throw new Error('Failed to fetch fighters');
      }
    } catch (error) {
      console.error('Error fetching fighters:', error);
      toast({
        title: 'Error',
        description: 'Failed to load fighter data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch latest comparisons (mock data for now)
  const fetchLatestComparisons = async () => {
    // This would normally be an API call
    setLatestComparisons([
      {
        id: 1,
        fighter1: { name: 'Israel Adesanya', division: 'Middleweight' },
        fighter2: { name: 'Alex Pereira', division: 'Middleweight' },
        date: '2 days ago'
      },
      {
        id: 2,
        fighter1: { name: 'Jon Jones', division: 'Heavyweight' },
        fighter2: { name: 'Stipe Miocic', division: 'Heavyweight' },
        date: '5 days ago'
      },
      {
        id: 3,
        fighter1: { name: 'Alexander Volkanovski', division: 'Featherweight' },
        fighter2: { name: 'Ilia Topuria', division: 'Featherweight' },
        date: '1 week ago'
      }
    ]);
  };
  
  // Handle weight category change
  const handleWeightCategoryChange = (categoryId: string) => {
    setSelectedWeightCategory(categoryId);
    // Reset selected fighters if changing weight class
    setFighter1(null);
    setFighter2(null);
  };
  
  // Handle fighter selection
  const handleFighter1Select = (fighter: Fighter) => {
    setFighter1(fighter);
  };
  
  const handleFighter2Select = (fighter: Fighter) => {
    setFighter2(fighter);
  };
  
  // Get current weight class name
  const currentWeightClassName = weightCategories.find(c => c.id === selectedWeightCategory)?.name || 'All Divisions';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <UFCNavbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold uppercase">FIGHTER COMPARISON TOOL</h1>
          <p className="text-lg text-gray-600">Compare fight stats, physical attributes, and records between any UFC fighters</p>
        </div>
        
        {/* Weight Category Selector */}
        <WeightCategorySelector 
          selectedCategory={selectedWeightCategory}
          onCategoryChange={handleWeightCategoryChange}
        />
        
        {/* Fighter Selection Section */}
        <div className="bg-white border border-gray-200 shadow-sm mb-8">
          <div className="bg-black text-white p-4">
            <h2 className="text-xl font-bold uppercase">{currentWeightClassName} FIGHTERS</h2>
            <p className="text-sm">Select two fighters to compare their stats</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fighter 1 Selector */}
              <div>
                <h3 className="text-lg font-bold mb-3">FIGHTER 1</h3>
                <UFCFighterSelector 
                  fighters={fighters}
                  weightClass={weightCategories.find(c => c.id === selectedWeightCategory)?.name}
                  isLoading={isLoading}
                  onSelect={handleFighter1Select}
                  position="left"
                />
                
                {/* Selected Fighter Preview */}
                {fighter1 && (
                  <div className="mt-4 flex items-center p-3 bg-gray-100 border border-gray-200">
                    {fighter1.image ? (
                      <img 
                        src={fighter1.image} 
                        alt={fighter1.name} 
                        className="h-24 w-20 mr-3 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/image/fighter/912/profile/912.png";
                        }}
                      />
                    ) : (
                      <div className="w-20 h-24 bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-xs text-gray-500">NO IMG</span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold">{fighter1.name}</p>
                      <p className="text-sm text-gray-600">{fighter1.division} • {fighter1.record}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Fighter 2 Selector */}
              <div>
                <h3 className="text-lg font-bold mb-3">FIGHTER 2</h3>
                <UFCFighterSelector 
                  fighters={fighters}
                  weightClass={weightCategories.find(c => c.id === selectedWeightCategory)?.name}
                  isLoading={isLoading}
                  onSelect={handleFighter2Select}
                  position="right"
                />
                
                {/* Selected Fighter Preview */}
                {fighter2 && (
                  <div className="mt-4 flex items-center p-3 bg-gray-100 border border-gray-200">
                    {fighter2.image ? (
                      <img 
                        src={fighter2.image} 
                        alt={fighter2.name} 
                        className="h-24 w-20 mr-3 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/image/fighter/912/profile/912.png";
                        }}
                      />
                    ) : (
                      <div className="w-20 h-24 bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-xs text-gray-500">NO IMG</span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold">{fighter2.name}</p>
                      <p className="text-sm text-gray-600">{fighter2.division} • {fighter2.record}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Fighter Comparison Results */}
        {fighter1 && fighter2 ? (
          <FighterComparisonUFC 
            fighter1={fighter1}
            fighter2={fighter2}
          />
        ) : (
          <div className="bg-white border border-gray-200 p-10 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-3">SELECT TWO FIGHTERS TO COMPARE</h3>
              <p className="text-gray-600 mb-6">Choose fighters from the same weight class for the most accurate comparison</p>
              
              {/* Popular Comparisons */}
              <div className="mt-8">
                <h4 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">POPULAR COMPARISONS</h4>
                <div className="space-y-3">
                  {latestComparisons.map(comparison => (
                    <div key={comparison.id} className="border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <p className="font-bold text-sm">{comparison.fighter1.name} vs {comparison.fighter2.name}</p>
                          <p className="text-xs text-gray-600">{comparison.fighter1.division}</p>
                        </div>
                        <span className="text-xs text-gray-500">{comparison.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-black text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">UFC FIGHT PREDICTOR</h3>
              <p className="text-sm text-gray-400">
                The ultimate tool for MMA fans to compare fighters, analyze matchups, 
                and get data-driven predictions for upcoming UFC fights.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">QUICK LINKS</h3>
              <ul className="space-y-2">
                {['Home', 'Fighters', 'Events', 'Rankings', 'Predictions', 'Compare'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">DISCLAIMER</h3>
              <p className="text-sm text-gray-400">
                UFC Fight Predictor is a fan-created tool and is not affiliated with UFC or any MMA organization.
                Fighter data and statistics are gathered from public sources and predictions are for entertainment purposes only.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">© 2025 UFC Fight Predictor. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}