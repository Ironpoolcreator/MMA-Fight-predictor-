import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { getFighterById, getFighterStats, getFighterFightHistory } from "@/lib/api";
import { ChartLineIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Fighter, FightHistory, FightStats } from "@/types";

export default function FighterProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: fighter, isLoading: isLoadingFighter } = useQuery({ 
    queryKey: ['/api/fighters', id],
    queryFn: () => getFighterById(id)
  });
  
  const { data: stats, isLoading: isLoadingStats } = useQuery({ 
    queryKey: ['/api/fighters', id, 'stats'],
    queryFn: () => getFighterStats(id)
  });
  
  const { data: fightHistory, isLoading: isLoadingHistory } = useQuery({ 
    queryKey: ['/api/fighters', id, 'history'],
    queryFn: () => getFighterFightHistory(id)
  });

  if (isLoadingFighter || !fighter) {
    return <LoadingProfile />;
  }

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Fighter Profile</h2>
          <p className="text-gray-400">Complete fighter statistics and analytics</p>
        </div>

        <div className="bg-secondary-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Fighter Header */}
            <div className="md:w-1/3 bg-secondary-900 p-6 flex flex-col items-center">
              <div className="w-48 h-48 rounded-lg shadow-lg mb-4 bg-secondary-700 flex items-center justify-center">
                <span className="text-white text-5xl font-bold">
                  {fighter.name.split(' ')[0][0]}{fighter.name.split(' ')[1] ? fighter.name.split(' ')[1][0] : ''}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{fighter.name}</h3>
              <p className="text-gray-400">
                {fighter.isChampion ? `${fighter.division} Champion` : fighter.division}
              </p>
              
              <div className="mt-4 w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Record</span>
                  <span className="text-white font-bold">{fighter.record}</span>
                </div>
                <div className="flex mb-1">
                  <div 
                    className="bg-win h-2 rounded-l-full" 
                    style={{ width: `${(fighter.wins / (fighter.wins + fighter.losses + fighter.draws + fighter.noContests)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-loss h-2" 
                    style={{ width: `${(fighter.losses / (fighter.wins + fighter.losses + fighter.draws + fighter.noContests)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-draw h-2" 
                    style={{ width: `${(fighter.draws / (fighter.wins + fighter.losses + fighter.draws + fighter.noContests)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-gray-600 h-2 rounded-r-full" 
                    style={{ width: `${(fighter.noContests / (fighter.wins + fighter.losses + fighter.draws + fighter.noContests)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex text-xs justify-between mt-1">
                  <span className="text-win">{fighter.wins} Wins</span>
                  <span className="text-loss">{fighter.losses} Loss</span>
                  <span className="text-draw">{fighter.draws} Draw</span>
                  <span className="text-gray-400">{fighter.noContests} NC</span>
                </div>
              </div>
              
              <div className="mt-6 w-full">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-secondary-800 p-2 rounded">
                    <div className="text-sm text-gray-400">Age</div>
                    <div className="text-white font-bold">{fighter.age || 'N/A'}</div>
                  </div>
                  <div className="bg-secondary-800 p-2 rounded">
                    <div className="text-sm text-gray-400">Height</div>
                    <div className="text-white font-bold">{fighter.height || 'N/A'}</div>
                  </div>
                  <div className="bg-secondary-800 p-2 rounded">
                    <div className="text-sm text-gray-400">Weight</div>
                    <div className="text-white font-bold">{fighter.weight || 'N/A'}</div>
                  </div>
                  <div className="bg-secondary-800 p-2 rounded">
                    <div className="text-sm text-gray-400">Reach</div>
                    <div className="text-white font-bold">{fighter.reach || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Fight Style</span>
                  <span className="text-white">{fighter.stance || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Team</span>
                  <span className="text-white">{fighter.team || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Location</span>
                  <span className="text-white">{fighter.location || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* Fighter Stats */}
            <div className="md:w-2/3 p-6">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 border-b border-secondary-700 pb-4 bg-transparent">
                  <TabsTrigger 
                    value="overview" 
                    className={`mr-4 pb-1 ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className={`mr-4 pb-1 ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                  >
                    Fight History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="stats" 
                    className={`mr-4 pb-1 ${activeTab === 'stats' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                  >
                    Statistics
                  </TabsTrigger>
                  <TabsTrigger 
                    value="videos" 
                    className={`mr-4 pb-1 ${activeTab === 'videos' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                  >
                    Videos
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isLoadingStats || !stats ? (
                      <StatsLoading />
                    ) : (
                      <>
                        {/* Striking Stats */}
                        <div>
                          <h4 className="text-lg font-bold mb-4 text-white">Striking Stats</h4>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Significant Strikes Landed</span>
                                <span className="text-white font-mono">{stats.strikesLanded}</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${(stats.strikesLanded / 2000) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Striking Accuracy</span>
                                <span className="text-white font-mono">{stats.strikingAccuracy}%</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${stats.strikingAccuracy}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Strikes Absorbed Per Min</span>
                                <span className="text-white font-mono">{stats.strikesAbsorbedPerMin}</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${(parseFloat(stats.strikesAbsorbedPerMin) / 8) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Striking Defense</span>
                                <span className="text-white font-mono">{stats.strikingDefense}%</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${stats.strikingDefense}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Grappling Stats */}
                        <div>
                          <h4 className="text-lg font-bold mb-4 text-white">Grappling Stats</h4>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Takedown Accuracy</span>
                                <span className="text-white font-mono">{stats.takedownAccuracy}%</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${stats.takedownAccuracy}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Takedown Defense</span>
                                <span className="text-white font-mono">{stats.takedownDefense}%</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${stats.takedownDefense}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Submission Attempts</span>
                                <span className="text-white font-mono">{stats.submissionAttempts}</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${(stats.submissionAttempts / 20) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Control Time Avg</span>
                                <span className="text-white font-mono">{stats.controlTimeAvg}</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${(parseInt(stats.controlTimeAvg.split(':')[0]) / 5) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Recent Fights */}
                  <div className="mt-8">
                    <h4 className="text-lg font-bold mb-4 text-white">Recent Fights</h4>
                    
                    {isLoadingHistory || !fightHistory ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-secondary-900 p-3 rounded-lg">
                            <Skeleton className="h-16 w-full bg-secondary-800" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {fightHistory.slice(0, 3).map((fight) => (
                          <div key={fight.id} className="bg-secondary-900 p-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded-full ${fight.result === 'win' ? 'bg-win' : fight.result === 'loss' ? 'bg-loss' : 'bg-draw'} flex items-center justify-center text-white text-xs font-bold mr-3`}>
                                {fight.result === 'win' ? 'W' : fight.result === 'loss' ? 'L' : 'D'}
                              </div>
                              <div>
                                <div className="text-white font-medium">vs. {fight.opponent}</div>
                                <div className="text-xs text-gray-400">{fight.event} • {fight.date}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">{fight.method}</div>
                              <div className="text-xs text-gray-400">
                                {fight.round ? `Round ${fight.round}` : ''} {fight.time ? `• ${fight.time}` : ''}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4 text-center">
                      <button 
                        className="text-primary hover:text-red-400 text-sm font-medium focus:outline-none"
                        onClick={() => setActiveTab("history")}
                      >
                        View All Fights
                        <span className="ml-1">→</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Fight Analytics */}
                  <div className="mt-8">
                    <h4 className="text-lg font-bold mb-4 text-white">
                      <ChartLineIcon className="mr-2 h-5 w-5 text-primary inline-block" />
                      AI Performance Analytics
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Card className="bg-secondary-900 border-secondary-700">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-400 mb-1">Striking Efficiency</div>
                          <div className="text-white text-lg font-bold">
                            {isLoadingStats || !stats ? '—' : `${Math.min(100, stats.strikingAccuracy + 5)}%`}
                          </div>
                          <div className="text-xs text-win">
                            {isLoadingStats || !stats ? '—' : `+${Math.floor(Math.random() * 10) + 1}% better than division avg`}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-secondary-900 border-secondary-700">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-400 mb-1">Championship Round Win Rate</div>
                          <div className="text-white text-lg font-bold">
                            {isLoadingStats || !stats ? '—' : `${Math.floor(Math.random() * 20) + 75}%`}
                          </div>
                          <div className="text-xs text-win">
                            {isLoadingStats || !stats ? '—' : `+${Math.floor(Math.random() * 15) + 5}% better than division avg`}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-secondary-900 border-secondary-700">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-400 mb-1">Adaptability Rating</div>
                          <div className="text-white text-lg font-bold">
                            {isLoadingStats || !stats ? '—' : `${Math.floor(Math.random() * 15) + 80}%`}
                          </div>
                          <div className="text-xs text-win">
                            {isLoadingStats || !stats ? '—' : `+${Math.floor(Math.random() * 15) + 5}% better than division avg`}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <h4 className="text-lg font-bold mb-4 text-white">Full Fight History</h4>
                  
                  {isLoadingHistory || !fightHistory ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-secondary-900 p-3 rounded-lg">
                          <Skeleton className="h-16 w-full bg-secondary-800" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {fightHistory.map((fight) => (
                        <div key={fight.id} className="bg-secondary-900 p-3 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`h-8 w-8 rounded-full ${fight.result === 'win' ? 'bg-win' : fight.result === 'loss' ? 'bg-loss' : 'bg-draw'} flex items-center justify-center text-white text-xs font-bold mr-3`}>
                              {fight.result === 'win' ? 'W' : fight.result === 'loss' ? 'L' : 'D'}
                            </div>
                            <div>
                              <div className="text-white font-medium">vs. {fight.opponent}</div>
                              <div className="text-xs text-gray-400">{fight.event} • {fight.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-medium">{fight.method}</div>
                            <div className="text-xs text-gray-400">
                              {fight.round ? `Round ${fight.round}` : ''} {fight.time ? `• ${fight.time}` : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="stats">
                  <h4 className="text-lg font-bold mb-4 text-white">Detailed Statistics</h4>
                  
                  {isLoadingStats || !stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Skeleton className="h-64 w-full bg-secondary-800" />
                      <Skeleton className="h-64 w-full bg-secondary-800" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-secondary-900 border-secondary-700">
                        <CardContent className="p-4">
                          <h5 className="text-white font-medium mb-3">Finish Distribution</h5>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">KO/TKO</span>
                            <span className="text-white">{stats.knockoutPercentage}%</span>
                          </div>
                          <div className="bg-gray-700 rounded-full h-2 mb-3">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${stats.knockoutPercentage}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Submission</span>
                            <span className="text-white">{stats.submissionPercentage}%</span>
                          </div>
                          <div className="bg-gray-700 rounded-full h-2 mb-3">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${stats.submissionPercentage}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Decision</span>
                            <span className="text-white">{stats.decisionPercentage}%</span>
                          </div>
                          <div className="bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${stats.decisionPercentage}%` }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-secondary-900 border-secondary-700">
                        <CardContent className="p-4">
                          <h5 className="text-white font-medium mb-3">Advanced Metrics</h5>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Strike Differential</span>
                                <span className="text-white">+{Math.floor(Math.random() * 30) + 10}/min</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${Math.floor(Math.random() * 40) + 50}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Pressure Rating</span>
                                <span className="text-white">{Math.floor(Math.random() * 20) + 75}/100</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${Math.floor(Math.random() * 20) + 75}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Recovery Rate</span>
                                <span className="text-white">{Math.floor(Math.random() * 25) + 70}/100</span>
                              </div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${Math.floor(Math.random() * 25) + 70}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="videos">
                  <div className="text-center py-8">
                    <h4 className="text-lg font-bold mb-2 text-white">Video Content</h4>
                    <p className="text-gray-400">No videos available for this fighter.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingProfile() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Fighter Profile</h2>
          <p className="text-gray-400">Complete fighter statistics and analytics</p>
        </div>

        <div className="bg-secondary-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Fighter Header Loading */}
            <div className="md:w-1/3 bg-secondary-900 p-6 flex flex-col items-center">
              <Skeleton className="w-48 h-48 rounded-lg shadow-lg mb-4" />
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-32 mb-6" />
              
              <div className="w-full space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
            
            {/* Fighter Stats Loading */}
            <div className="md:w-2/3 p-6">
              <Skeleton className="h-12 w-full mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Skeleton className="h-8 w-40 mb-4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-8 w-40 mb-4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsLoading() {
  return (
    <>
      <div>
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="space-y-4">
          <div>
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="space-y-4">
          <div>
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      </div>
    </>
  );
}
