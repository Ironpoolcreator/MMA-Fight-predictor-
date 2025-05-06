import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, PieChart, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, Pie, Area, Cell } from "recharts";
import { Dumbbell, Trophy, TrendingUp } from "lucide-react";

export default function Analytics() {
  const [timeFrame, setTimeFrame] = useState("year");
  const [weightClass, setWeightClass] = useState("all");
  
  // Mock data for victory methods
  const victoryMethodsData = [
    { name: "KO/TKO", value: 34, color: "#ef4444" },
    { name: "Submission", value: 28, color: "#3b82f6" },
    { name: "Decision", value: 38, color: "#10b981" },
  ];
  
  // Mock data for fight durations
  const fightDurationData = [
    { name: "Round 1", KO: 22, Submission: 12, Decision: 0 },
    { name: "Round 2", KO: 7, Submission: 8, Decision: 0 },
    { name: "Round 3", KO: 5, Submission: 8, Decision: 20 },
    { name: "Round 4", KO: 0, Submission: 0, Decision: 8 },
    { name: "Round 5", KO: 0, Submission: 0, Decision: 10 },
  ];
  
  // Mock data for fight stats by division
  const statsByDivisionData = [
    { division: "HW", knockouts: 8, submissions: 3, decisions: 4 },
    { division: "LHW", knockouts: 6, submissions: 2, decisions: 7 },
    { division: "MW", knockouts: 5, submissions: 4, decisions: 6 },
    { division: "WW", knockouts: 4, submissions: 5, decisions: 6 },
    { division: "LW", knockouts: 3, submissions: 7, decisions: 5 },
    { division: "FW", knockouts: 4, submissions: 4, decisions: 7 },
    { division: "BW", knockouts: 4, submissions: 3, decisions: 8 },
  ];
  
  // Mock data for monthly events
  const monthlyEventsData = [
    { name: "Jan", events: 4, mainEvents: 1, titleFights: 3 },
    { name: "Feb", events: 3, mainEvents: 1, titleFights: 2 },
    { name: "Mar", events: 5, mainEvents: 1, titleFights: 3 },
    { name: "Apr", events: 4, mainEvents: 1, titleFights: 2 },
    { name: "May", events: 5, mainEvents: 1, titleFights: 4 },
    { name: "Jun", events: 4, mainEvents: 1, titleFights: 2 },
    { name: "Jul", events: 5, mainEvents: 1, titleFights: 3 },
    { name: "Aug", events: 3, mainEvents: 1, titleFights: 2 },
    { name: "Sep", events: 4, mainEvents: 1, titleFights: 3 },
    { name: "Oct", events: 4, mainEvents: 1, titleFights: 2 },
    { name: "Nov", events: 5, mainEvents: 1, titleFights: 4 },
    { name: "Dec", events: 4, mainEvents: 1, titleFights: 3 },
  ];
  
  // Mock data for championship stats
  const championshipStatsData = [
    { name: "Champions", newChamps: 8, defenses: 14, color: "#ef4444" },
    { name: "Challengers", upsets: 8, failed: 14, color: "#3b82f6" },
  ];
  
  // Mock data for fighter stats
  const fighterStatsData = [
    { name: "Striking Accuracy", max: 100, average: 48, top: 68 },
    { name: "Takedown Accuracy", max: 100, average: 46, top: 72 },
    { name: "Submission Rate", max: 100, average: 35, top: 65 },
    { name: "KO Rate", max: 100, average: 38, top: 68 },
    { name: "Fight IQ", max: 100, average: 52, top: 75 },
    { name: "Cardio", max: 100, average: 58, top: 78 },
  ];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Fight Analytics</h2>
          <p className="text-gray-400">Comprehensive data and statistics for MMA events and fighters</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between mb-8 gap-4">
          <div>
            <Tabs defaultValue={timeFrame} onValueChange={setTimeFrame} className="w-full">
              <TabsList className="bg-secondary-800">
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="w-full lg:w-60">
            <Select defaultValue={weightClass} onValueChange={setWeightClass}>
              <SelectTrigger className="bg-secondary-800 border-secondary-700 text-white">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent className="bg-secondary-800 border-secondary-700 text-white">
                <SelectItem value="all">All Divisions</SelectItem>
                <SelectItem value="hw">Heavyweight</SelectItem>
                <SelectItem value="lhw">Light Heavyweight</SelectItem>
                <SelectItem value="mw">Middleweight</SelectItem>
                <SelectItem value="ww">Welterweight</SelectItem>
                <SelectItem value="lw">Lightweight</SelectItem>
                <SelectItem value="fw">Featherweight</SelectItem>
                <SelectItem value="bw">Bantamweight</SelectItem>
                <SelectItem value="fly">Flyweight</SelectItem>
                <SelectItem value="wsw">Women's Strawweight</SelectItem>
                <SelectItem value="wfly">Women's Flyweight</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-secondary-800 border-secondary-700">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Victory Methods
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={victoryMethodsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {victoryMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} 
                      formatter={(value) => [`${value} fights`, 'Number of Fights']}
                    />
                    <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary-800 border-secondary-700">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-primary" />
                Fight Duration Analysis
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fightDurationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} 
                    />
                    <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
                    <Bar dataKey="KO" stackId="a" fill="#ef4444" />
                    <Bar dataKey="Submission" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Decision" stackId="a" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-secondary-800 border-secondary-700 mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Events Throughout The Year
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyEventsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} 
                  />
                  <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
                  <Line type="monotone" dataKey="events" stroke="#10b981" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="titleFights" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-secondary-800 border-secondary-700">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold text-white mb-4">Results by Division</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsByDivisionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="division" type="category" stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} 
                    />
                    <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
                    <Bar dataKey="knockouts" fill="#ef4444" name="KO/TKO" />
                    <Bar dataKey="submissions" fill="#3b82f6" name="Submissions" />
                    <Bar dataKey="decisions" fill="#10b981" name="Decisions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary-800 border-secondary-700">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold text-white mb-4">Fighter Performance Metrics</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fighterStatsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} 
                    />
                    <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
                    <Area type="monotone" dataKey="top" fill="#ef4444" fillOpacity={0.6} stroke="#ef4444" name="Top Fighters" />
                    <Area type="monotone" dataKey="average" fill="#3b82f6" fillOpacity={0.6} stroke="#3b82f6" name="Average" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}