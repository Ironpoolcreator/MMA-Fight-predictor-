import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

interface Fight {
  id: number;
  weightClass: string;
  fighter1: {
    id: number;
    name: string;
    rank: number;
    country: string;
    countryCode: string;
    image: string;
  };
  fighter2: {
    id: number;
    name: string;
    rank: number;
    country: string;
    countryCode: string;
    image: string;
  };
  odds: {
    fighter1: number;
    fighter2: number;
  };
}

export default function Fights() {
  const [fights, setFights] = useState<Fight[]>([]);
  const [activeTab, setActiveTab] = useState<'MAIN CARD' | 'PRELIMS'>('MAIN CARD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data since we don't have a real API endpoint for this exact structure
    setIsLoading(true);
    
    // Simulate API fetch delay
    setTimeout(() => {
      const mockFights: Fight[] = [
        {
          id: 1,
          weightClass: 'WELTERWEIGHT BOUT',
          fighter1: {
            id: 101,
            name: 'IAN MACHADO GARRY',
            rank: 7,
            country: 'IRELAND',
            countryCode: 'ie',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-12/GARRY_IAN_L.png?itok=m3QH_1EB'
          },
          fighter2: {
            id: 102,
            name: 'CARLOS PRATES',
            rank: 13,
            country: 'BRAZIL',
            countryCode: 'br',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-10/PRATES_CARLOS_R.png?itok=DLjvWd-a'
          },
          odds: {
            fighter1: -122,
            fighter2: 102
          }
        },
        {
          id: 2,
          weightClass: 'LIGHT HEAVYWEIGHT BOUT',
          fighter1: {
            id: 103,
            name: 'ANTHONY SMITH',
            rank: 15,
            country: 'UNITED STATES',
            countryCode: 'us',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-05/SMITH_ANTHONY_L_05-13.png?itok=tRO4y-cT'
          },
          fighter2: {
            id: 104,
            name: 'ZHANG MINGYANG',
            rank: 0,
            country: 'CHINA',
            countryCode: 'cn',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-11/ZHANG_MINGYANG_R.png?itok=_UiLFRHh'
          },
          odds: {
            fighter1: 380,
            fighter2: -500
          }
        },
        {
          id: 3,
          weightClass: 'FEATHERWEIGHT BOUT',
          fighter1: {
            id: 105,
            name: 'GIGA CHIKADZE',
            rank: 12,
            country: 'GEORGIA',
            countryCode: 'ge',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2021-08/67772%252Fprofile-galery%252Ffullbodyleft-picture%252FCHIKADZE_GIGA_L_08-07.png?itok=oqec5bj8'
          },
          fighter2: {
            id: 106,
            name: 'DAVID ONAMA',
            rank: 0,
            country: 'UGANDA',
            countryCode: 'ug',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-02/ONAMA_DAVID_R_02-18.png?itok=QRDi5cgP'
          },
          odds: {
            fighter1: -250,
            fighter2: 210
          }
        }
      ];
      
      setFights(mockFights);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Top Event Header */}
      <div className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center">
            <div className="h-20 w-20 overflow-hidden mr-4">
              <img 
                src="https://dmxg5wxfqgb4u.cloudfront.net/styles/event_fight_card_upper_body/s3/2024-03/Apr26_FN_Garry_Prates_1920x1080.jpg" 
                alt="UFC Event" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">UFC Fight Night</h1>
              <p className="text-sm opacity-80">Sat, Apr 26 / 8:00 PM CDT, T-Mobile Center, Kansas City United States</p>
            </div>
          </div>
          <a 
            href="#" 
            className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-6 py-2 font-bold uppercase text-sm tracking-wider"
          >
            HOW TO WATCH
          </a>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex">
            <button 
              className={`py-4 px-8 font-bold ${activeTab === 'MAIN CARD' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('MAIN CARD')}
            >
              MAIN CARD
            </button>
            <button 
              className={`py-4 px-8 font-bold ${activeTab === 'PRELIMS' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('PRELIMS')}
            >
              PRELIMS
            </button>
          </div>
        </div>
      </div>
      
      {/* Fight Cards */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {fights.map(fight => (
              <div key={fight.id} className="border border-gray-200 rounded-sm overflow-hidden">
                {/* Weight Class Header */}
                <div className="bg-gray-100 py-2 px-4 text-center">
                  <h3 className="font-bold text-gray-600 text-sm tracking-wider">{fight.weightClass}</h3>
                </div>
                
                {/* Fighter Comparison */}
                <div className="grid grid-cols-8 sm:grid-cols-9 gap-2 py-4">
                  {/* Left Fighter */}
                  <div className="col-span-3 sm:col-span-4 pl-4 pr-2 flex flex-col items-start justify-center">
                    {fight.fighter1.rank > 0 && (
                      <div className="text-gray-600 text-sm font-bold mb-1">#{fight.fighter1.rank}</div>
                    )}
                    <h4 className="font-bold text-lg sm:text-xl tracking-wider mb-2">
                      {fight.fighter1.name}
                    </h4>
                    <div className="flex items-center">
                      <span className="text-xs font-bold mr-1">{fight.fighter1.country}</span>
                      <div className="w-5 h-4 overflow-hidden">
                        <div className={`flag flag-${fight.fighter1.countryCode.toLowerCase()}`}>
                          {/* Flag image would be displayed via CSS */}
                          <div className={`w-5 h-4 bg-gray-200 relative`}>
                            {fight.fighter1.countryCode === 'ie' && (
                              <div className="absolute inset-0 flex items-center justify-center text-xs">🇮🇪</div>
                            )}
                            {fight.fighter1.countryCode === 'us' && (
                              <div className="absolute inset-0 flex items-center justify-center text-xs">🇺🇸</div>
                            )}
                            {fight.fighter1.countryCode === 'ge' && (
                              <div className="absolute inset-0 flex items-center justify-center text-xs">🇬🇪</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fighter Images */}
                  <div className="col-span-2 flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="bg-black text-white font-bold text-sm px-3 py-1">VS</div>
                    </div>
                    
                    <div className="h-32 w-16 relative">
                      <img 
                        src={fight.fighter1.image} 
                        alt={fight.fighter1.name}
                        className="absolute bottom-0 right-0 h-full object-contain"
                      />
                    </div>
                    <div className="h-32 w-16 relative">
                      <img 
                        src={fight.fighter2.image} 
                        alt={fight.fighter2.name}
                        className="absolute bottom-0 left-0 h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Right Fighter */}
                  <div className="col-span-3 sm:col-span-3 pr-4 pl-2 flex flex-col items-end justify-center">
                    {fight.fighter2.rank > 0 && (
                      <div className="text-gray-600 text-sm font-bold mb-1">#{fight.fighter2.rank}</div>
                    )}
                    <h4 className="font-bold text-lg sm:text-xl tracking-wider mb-2 text-right">
                      {fight.fighter2.name}
                    </h4>
                    <div className="flex items-center">
                      <div className="w-5 h-4 overflow-hidden mr-1">
                        <div className={`flag flag-${fight.fighter2.countryCode.toLowerCase()}`}>
                          {/* Flag image would be displayed via CSS */}
                          <div className={`w-5 h-4 bg-gray-200 relative`}>
                            {fight.fighter2.countryCode === 'br' && (
                              <div className="absolute inset-0 flex items-center justify-center text-xs">🇧🇷</div>
                            )}
                            {fight.fighter2.countryCode === 'cn' && (
                              <div className="absolute inset-0 flex items-center justify-center text-xs">🇨🇳</div>
                            )}
                            {fight.fighter2.countryCode === 'ug' && (
                              <div className="absolute inset-0 flex items-center justify-center text-xs">🇺🇬</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold">{fight.fighter2.country}</span>
                    </div>
                  </div>
                </div>
                
                {/* Odds Section */}
                <div className="grid grid-cols-3 border-t border-gray-200 text-center py-2">
                  <div className="text-sm font-bold">
                    {fight.odds.fighter1 > 0 ? `+${fight.odds.fighter1}` : fight.odds.fighter1}
                  </div>
                  <div className="text-xs font-bold text-gray-500 uppercase">Odds</div>
                  <div className="text-sm font-bold">
                    {fight.odds.fighter2 > 0 ? `+${fight.odds.fighter2}` : fight.odds.fighter2}
                  </div>
                </div>
                
                {/* Compare Link */}
                <div className="border-t border-gray-200 text-center">
                  <Link 
                    to={`/compare?fighter1=${fight.fighter1.id}&fighter2=${fight.fighter2.id}`}
                    className="block text-red-600 hover:bg-gray-50 transition py-2 text-sm font-bold"
                  >
                    COMPARE FIGHTERS
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}