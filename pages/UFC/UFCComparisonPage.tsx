import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import UFCFighterSelector from '../../components/UFC/UFCFighterSelector';
import AnimatedStatComparison from '../../components/UFC/AnimatedStatComparison';
import { Fighter } from '../../types';
import { motion } from 'framer-motion';

export default function UFCComparisonPage() {
  const [selectedWeightCategory, setSelectedWeightCategory] = useState<number | null>(null);
  const [fighter1, setFighter1] = useState<Fighter | null>(null);
  const [fighter2, setFighter2] = useState<Fighter | null>(null);
  const [comparisonStats, setComparisonStats] = useState<any[]>([]);
  
  // Weight categories from UFC
  const weightCategories = [
    { id: 1, name: 'Heavyweight' },
    { id: 2, name: 'Light Heavyweight' },
    { id: 3, name: 'Middleweight' },
    { id: 4, name: 'Welterweight' },
    { id: 5, name: 'Lightweight' },
    { id: 6, name: 'Featherweight' },
    { id: 7, name: 'Bantamweight' },
    { id: 8, name: 'Flyweight' },
    { id: 9, name: "Women's Bantamweight" },
    { id: 10, name: "Women's Flyweight" },
    { id: 11, name: "Women's Strawweight" }
  ];
  
  // Fetch fighters from API
  const { data: fighters = [], isLoading } = useQuery<Fighter[]>({
    queryKey: ['/api/fighters'],
    enabled: true,
  });
  
  // Handle fighter selections
  const handleFighter1Select = (fighter: Fighter) => {
    setFighter1(fighter);
    
    // Auto-select weight class if not already selected
    if (!selectedWeightCategory) {
      const weightClass = weightCategories.find(
        wc => fighter.division?.includes(wc.name)
      );
      if (weightClass) setSelectedWeightCategory(weightClass.id);
    }
  };
  
  const handleFighter2Select = (fighter: Fighter) => {
    setFighter2(fighter);
    
    // Auto-select weight class if not already selected
    if (!selectedWeightCategory) {
      const weightClass = weightCategories.find(
        wc => fighter.division?.includes(wc.name)
      );
      if (weightClass) setSelectedWeightCategory(weightClass.id);
    }
  };
  
  // Generate comparison stats when fighters change
  useEffect(() => {
    if (fighter1 && fighter2) {
      const stats = generateComparisonStats(fighter1, fighter2);
      setComparisonStats(stats);
    } else {
      setComparisonStats([]);
    }
  }, [fighter1, fighter2]);
  
  // Generate comparison stats based on fighter attributes
  const generateComparisonStats = (fighter1: Fighter, fighter2: Fighter) => {
    // Parse stats from fighters (normally this would be from API/DB)
    const f1Strikes = parseFloat(fighter1.strikesLandedPerMin || '0');
    const f2Strikes = parseFloat(fighter2.strikesLandedPerMin || '0');
    
    const f1StrikeAcc = parseFloat(fighter1.strikingAccuracy?.replace('%', '') || '0') / 100;
    const f2StrikeAcc = parseFloat(fighter2.strikingAccuracy?.replace('%', '') || '0') / 100;
    
    const f1TdAvg = parseFloat(fighter1.takedownsLandedPerMatch || '0');
    const f2TdAvg = parseFloat(fighter2.takedownsLandedPerMatch || '0');
    
    const f1TdAcc = parseFloat(fighter1.takedownAccuracy?.replace('%', '') || '0') / 100;
    const f2TdAcc = parseFloat(fighter2.takedownAccuracy?.replace('%', '') || '0') / 100;
    
    const f1TdDef = parseFloat(fighter1.takedownDefense?.replace('%', '') || '0') / 100;
    const f2TdDef = parseFloat(fighter2.takedownDefense?.replace('%', '') || '0') / 100;
    
    const f1Height = fighter1.height || '0';
    const f2Height = fighter2.height || '0';
    
    const f1Reach = parseFloat(fighter1.reach?.replace('"', '') || '0');
    const f2Reach = parseFloat(fighter2.reach?.replace('"', '') || '0');
    
    const f1Age = fighter1.age ? parseInt(fighter1.age.toString()) : 0;
    const f2Age = fighter2.age ? parseInt(fighter2.age.toString()) : 0;
    
    // Calculate win statistics - handle null/undefined values safely
    const parseWins = (val: string | number | null | undefined): number => {
      if (val === null || val === undefined) return 0;
      const strVal = val.toString();
      if (!strVal) return 0;
      const parsed = parseInt(strVal);
      return isNaN(parsed) ? 0 : parsed;
    };
    
    const f1KoWins = parseWins(fighter1.knockoutWins);
    const f1SubWins = parseWins(fighter1.submissionWins);
    const f1DecWins = parseWins(fighter1.decisionWins);
    const f1Wins = f1KoWins + f1SubWins + f1DecWins;
    
    const f2KoWins = parseWins(fighter2.knockoutWins);
    const f2SubWins = parseWins(fighter2.submissionWins);
    const f2DecWins = parseWins(fighter2.decisionWins);
    const f2Wins = f2KoWins + f2SubWins + f2DecWins;
    
    // Build comparison stats array
    return [
      {
        label: 'Striking Accuracy',
        fighter1Value: f1StrikeAcc,
        fighter2Value: f2StrikeAcc,
        type: 'percentage',
        higherIsBetter: true
      },
      {
        label: 'Strikes Landed Per Min',
        fighter1Value: f1Strikes,
        fighter2Value: f2Strikes,
        type: 'number',
        higherIsBetter: true
      },
      {
        label: 'Takedown Accuracy',
        fighter1Value: f1TdAcc,
        fighter2Value: f2TdAcc,
        type: 'percentage',
        higherIsBetter: true
      },
      {
        label: 'Takedown Defense',
        fighter1Value: f1TdDef,
        fighter2Value: f2TdDef,
        type: 'percentage',
        higherIsBetter: true
      },
      {
        label: 'Takedowns Per Match',
        fighter1Value: f1TdAvg,
        fighter2Value: f2TdAvg,
        type: 'number',
        higherIsBetter: true
      },
      {
        label: 'Total Wins',
        fighter1Value: f1Wins,
        fighter2Value: f2Wins,
        type: 'number',
        higherIsBetter: true
      }
    ];
  };
  
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-black py-6">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold uppercase text-center">UFC Fighter Comparison</h1>
          <p className="text-center text-gray-400 mt-2">Compare stats, records and fighting style</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 p-6 rounded-sm shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wider">Select Fighters</h2>
          
          {/* Weight Class Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">WEIGHT CLASS</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {weightCategories.map(category => (
                <button
                  key={category.id}
                  className={`py-2 px-3 text-sm text-center border border-gray-600 ${
                    selectedWeightCategory === category.id 
                      ? 'bg-red-600 border-red-600 text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedWeightCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fighter 1 Selector */}
            <div>
              <h3 className="text-lg font-medium mb-3">FIGHTER 1</h3>
              <UFCFighterSelector 
                fighters={fighters}
                weightClass={weightCategories.find(c => c.id === selectedWeightCategory)?.name}
                isLoading={isLoading}
                onSelect={handleFighter1Select}
                position="left"
              />
              
              {/* Selected Fighter Preview */}
              {fighter1 && (
                <motion.div 
                  className="mt-4 flex items-center p-3 bg-black"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {fighter1.image ? (
                    <img 
                      src={fighter1.image} 
                      alt={fighter1.name} 
                      className="w-20 h-24 object-cover object-top mr-3"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://www.ufc.com/themes/custom/ufc/assets/img/no-profile-image.png";
                      }}
                    />
                  ) : (
                    <div className="w-20 h-24 bg-gray-700 flex items-center justify-center mr-3">
                      <span className="text-xs text-gray-400">NO IMG</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{fighter1.name}</p>
                    <p className="text-sm text-gray-400">{fighter1.division} • {fighter1.record}</p>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Fighter 2 Selector */}
            <div>
              <h3 className="text-lg font-medium mb-3">FIGHTER 2</h3>
              <UFCFighterSelector 
                fighters={fighters}
                weightClass={weightCategories.find(c => c.id === selectedWeightCategory)?.name}
                isLoading={isLoading}
                onSelect={handleFighter2Select}
                position="right"
              />
              
              {/* Selected Fighter Preview */}
              {fighter2 && (
                <motion.div 
                  className="mt-4 flex items-center p-3 bg-black"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {fighter2.image ? (
                    <img 
                      src={fighter2.image} 
                      alt={fighter2.name} 
                      className="w-20 h-24 object-cover object-top mr-3"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://www.ufc.com/themes/custom/ufc/assets/img/no-profile-image.png";
                      }}
                    />
                  ) : (
                    <div className="w-20 h-24 bg-gray-700 flex items-center justify-center mr-3">
                      <span className="text-xs text-gray-400">NO IMG</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{fighter2.name}</p>
                    <p className="text-sm text-gray-400">{fighter2.division} • {fighter2.record}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        {/* Comparison Results */}
        {fighter1 && fighter2 && comparisonStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <AnimatedStatComparison 
              fighter1={fighter1}
              fighter2={fighter2}
              stats={comparisonStats}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}