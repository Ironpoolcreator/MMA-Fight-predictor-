import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export default function Rankings() {
  const [weightClass, setWeightClass] = useState("heavyweight");
  
  // Mock data for rankings by division
  const rankingsData = {
    heavyweight: [
      { rank: "C", name: "Jon Jones", record: "27-1-0", country: "USA", isChampion: true },
      { rank: "1", name: "Ciryl Gane", record: "11-2-0", country: "France" },
      { rank: "2", name: "Stipe Miocic", record: "20-4-0", country: "USA" },
      { rank: "3", name: "Tom Aspinall", record: "12-3-0", country: "England" },
      { rank: "4", name: "Sergei Pavlovich", record: "16-1-0", country: "Russia" },
      { rank: "5", name: "Curtis Blaydes", record: "15-4-0", country: "USA" },
      { rank: "6", name: "Alexander Volkov", record: "35-10-0", country: "Russia" },
      { rank: "7", name: "Jailton Almeida", record: "18-2-0", country: "Brazil" },
      { rank: "8", name: "Tai Tuivasa", record: "14-5-0", country: "Australia" },
      { rank: "9", name: "Derrick Lewis", record: "26-10-0", country: "USA" },
      { rank: "10", name: "Marcin Tybura", record: "23-7-0", country: "Poland" },
    ],
    lightheavyweight: [
      { rank: "C", name: "Alex Pereira", record: "8-1-0", country: "Brazil", isChampion: true },
      { rank: "1", name: "Jamahal Hill", record: "11-1-0", country: "USA" },
      { rank: "2", name: "Jiri Prochazka", record: "29-4-1", country: "Czech Republic" },
      { rank: "3", name: "Magomed Ankalaev", record: "17-1-1", country: "Russia" },
      { rank: "4", name: "Jan Blachowicz", record: "29-9-1", country: "Poland" },
      { rank: "5", name: "Aleksandar Rakic", record: "14-3-0", country: "Austria" },
      { rank: "6", name: "Nikita Krylov", record: "28-9-0", country: "Ukraine" },
      { rank: "7", name: "Khalil Rountree Jr.", record: "11-5-0", country: "USA" },
      { rank: "8", name: "Volkan Oezdemir", record: "18-6-0", country: "Switzerland" },
      { rank: "9", name: "Ryan Spann", record: "21-8-0", country: "USA" },
      { rank: "10", name: "Johnny Walker", record: "20-7-0", country: "Brazil" },
    ],
    middleweight: [
      { rank: "C", name: "Dricus Du Plessis", record: "19-2-0", country: "South Africa", isChampion: true },
      { rank: "1", name: "Israel Adesanya", record: "24-3-0", country: "Nigeria" },
      { rank: "2", name: "Robert Whittaker", record: "25-7-0", country: "Australia" },
      { rank: "3", name: "Sean Strickland", record: "28-5-0", country: "USA" },
      { rank: "4", name: "Jared Cannonier", record: "17-6-0", country: "USA" },
      { rank: "5", name: "Marvin Vettori", record: "19-6-1", country: "Italy" },
      { rank: "6", name: "Paulo Costa", record: "14-3-0", country: "Brazil" },
      { rank: "7", name: "Nassourdine Imavov", record: "11-3-0", country: "France" },
      { rank: "8", name: "Brendan Allen", record: "22-5-0", country: "USA" },
      { rank: "9", name: "Roman Dolidze", record: "12-2-0", country: "Georgia" },
      { rank: "10", name: "Caio Borralho", record: "14-1-0", country: "Brazil" },
    ],
    welterweight: [
      { rank: "C", name: "Leon Edwards", record: "21-3-0", country: "England", isChampion: true },
      { rank: "1", name: "Belal Muhammad", record: "22-3-0", country: "USA" },
      { rank: "2", name: "Kamaru Usman", record: "20-3-0", country: "Nigeria" },
      { rank: "3", name: "Shavkat Rakhmonov", record: "16-0-0", country: "Kazakhstan" },
      { rank: "4", name: "Colby Covington", record: "17-3-0", country: "USA" },
      { rank: "5", name: "Gilbert Burns", record: "22-6-0", country: "Brazil" },
      { rank: "6", name: "Sean Brady", record: "15-1-0", country: "USA" },
      { rank: "7", name: "Jack Della Maddalena", record: "14-2-0", country: "Australia" },
      { rank: "8", name: "Vicente Luque", record: "21-9-1", country: "Brazil" },
      { rank: "9", name: "Stephen Thompson", record: "17-7-1", country: "USA" },
      { rank: "10", name: "Michael Page", record: "21-2-0", country: "England" },
    ],
    lightweight: [
      { rank: "C", name: "Islam Makhachev", record: "24-1-0", country: "Russia", isChampion: true },
      { rank: "1", name: "Charles Oliveira", record: "33-9-0", country: "Brazil" },
      { rank: "2", name: "Dustin Poirier", record: "29-8-0", country: "USA" },
      { rank: "3", name: "Justin Gaethje", record: "25-4-0", country: "USA" },
      { rank: "4", name: "Arman Tsarukyan", record: "20-3-0", country: "Armenia" },
      { rank: "5", name: "Michael Chandler", record: "23-8-0", country: "USA" },
      { rank: "6", name: "Mateusz Gamrot", record: "22-2-0", country: "Poland" },
      { rank: "7", name: "Beneil Dariush", record: "22-5-1", country: "USA" },
      { rank: "8", name: "Dan Hooker", record: "23-12-0", country: "New Zealand" },
      { rank: "9", name: "Rafael Fiziev", record: "12-3-0", country: "Azerbaijan" },
      { rank: "10", name: "Renato Moicano", record: "17-5-1", country: "Brazil" },
    ],
    featherweight: [
      { rank: "C", name: "Ilia Topuria", record: "14-0-0", country: "Spain", isChampion: true },
      { rank: "1", name: "Alexander Volkanovski", record: "26-3-0", country: "Australia" },
      { rank: "2", name: "Max Holloway", record: "25-7-0", country: "USA" },
      { rank: "3", name: "Brian Ortega", record: "15-3-0", country: "USA" },
      { rank: "4", name: "Yair Rodriguez", record: "15-4-0", country: "Mexico" },
      { rank: "5", name: "Movsar Evloev", record: "17-0-0", country: "Russia" },
      { rank: "6", name: "Josh Emmett", record: "18-4-0", country: "USA" },
      { rank: "7", name: "Arnold Allen", record: "19-2-0", country: "England" },
      { rank: "8", name: "Calvin Kattar", record: "23-7-0", country: "USA" },
      { rank: "9", name: "Giga Chikadze", record: "14-3-0", country: "Georgia" },
      { rank: "10", name: "Bryce Mitchell", record: "15-1-0", country: "USA" },
    ],
    bantamweight: [
      { rank: "C", name: "Sean O'Malley", record: "17-1-0", country: "USA", isChampion: true },
      { rank: "1", name: "Merab Dvalishvili", record: "16-4-0", country: "Georgia" },
      { rank: "2", name: "Aljamain Sterling", record: "23-4-0", country: "USA" },
      { rank: "3", name: "Henry Cejudo", record: "16-3-0", country: "USA" },
      { rank: "4", name: "Cory Sandhagen", record: "16-4-0", country: "USA" },
      { rank: "5", name: "Petr Yan", record: "16-5-0", country: "Russia" },
      { rank: "6", name: "Marlon Vera", record: "21-8-1", country: "Ecuador" },
      { rank: "7", name: "Song Yadong", record: "20-7-1", country: "China" },
      { rank: "8", name: "Rob Font", record: "20-7-0", country: "USA" },
      { rank: "9", name: "Deiveson Figueiredo", record: "22-3-1", country: "Brazil" },
      { rank: "10", name: "Umar Nurmagomedov", record: "16-0-0", country: "Russia" },
    ],
    flyweight: [
      { rank: "C", name: "Alexandre Pantoja", record: "26-5-0", country: "Brazil", isChampion: true },
      { rank: "1", name: "Brandon Moreno", record: "21-7-2", country: "Mexico" },
      { rank: "2", name: "Brandon Royval", record: "15-6-0", country: "USA" },
      { rank: "3", name: "Kai Kara-France", record: "24-10-0", country: "New Zealand" },
      { rank: "4", name: "Amir Albazi", record: "16-1-0", country: "Iraq" },
      { rank: "5", name: "Alex Perez", record: "24-8-0", country: "USA" },
      { rank: "6", name: "Matheus Nicolau", record: "19-3-1", country: "Brazil" },
      { rank: "7", name: "Manel Kape", record: "19-6-0", country: "Angola" },
      { rank: "8", name: "Muhammad Mokaev", record: "10-0-0", country: "Russia" },
      { rank: "9", name: "Tim Elliott", record: "19-12-1", country: "USA" },
      { rank: "10", name: "Steve Erceg", record: "10-1-0", country: "Australia" },
    ],
    "women'sstrawweight": [
      { rank: "C", name: "Weili Zhang", record: "24-3-0", country: "China", isChampion: true },
      { rank: "1", name: "Rose Namajunas", record: "12-6-0", country: "USA" },
      { rank: "2", name: "Yan Xiaonan", record: "17-3-0", country: "China" },
      { rank: "3", name: "Carla Esparza", record: "19-7-0", country: "USA" },
      { rank: "4", name: "Jessica Andrade", record: "24-11-0", country: "Brazil" },
      { rank: "5", name: "Amanda Lemos", record: "13-3-1", country: "Brazil" },
      { rank: "6", name: "Virna Jandiroba", record: "19-3-0", country: "Brazil" },
      { rank: "7", name: "Marina Rodriguez", record: "17-4-2", country: "Brazil" },
      { rank: "8", name: "Mackenzie Dern", record: "13-4-0", country: "USA" },
      { rank: "9", name: "Tabatha Ricci", record: "9-1-0", country: "Brazil" },
      { rank: "10", name: "Loopy Godinez", record: "10-3-0", country: "Mexico" },
    ],
    "women'sflyweight": [
      { rank: "C", name: "Alexa Grasso", record: "16-3-1", country: "Mexico", isChampion: true },
      { rank: "1", name: "Valentina Shevchenko", record: "23-4-1", country: "Kyrgyzstan" },
      { rank: "2", name: "Manon Fiorot", record: "10-1-0", country: "France" },
      { rank: "3", name: "Erin Blanchfield", record: "11-1-0", country: "USA" },
      { rank: "4", name: "Rose Namajunas", record: "12-6-0", country: "USA" },
      { rank: "5", name: "Natalia Silva", record: "16-5-1", country: "Brazil" },
      { rank: "6", name: "Jessica Andrade", record: "24-11-0", country: "Brazil" },
      { rank: "7", name: "Maycee Barber", record: "13-2-0", country: "USA" },
      { rank: "8", name: "Tracy Cortez", record: "10-1-0", country: "USA" },
      { rank: "9", name: "Amanda Ribas", record: "12-4-0", country: "Brazil" },
      { rank: "10", name: "Karine Silva", record: "16-4-0", country: "Brazil" },
    ],
  };
  
  const weightClasses = [
    { id: "heavyweight", name: "Heavyweight" },
    { id: "lightheavyweight", name: "Light Heavyweight" },
    { id: "middleweight", name: "Middleweight" },
    { id: "welterweight", name: "Welterweight" },
    { id: "lightweight", name: "Lightweight" },
    { id: "featherweight", name: "Featherweight" },
    { id: "bantamweight", name: "Bantamweight" },
    { id: "flyweight", name: "Flyweight" },
    { id: "women'sstrawweight", name: "Women's Strawweight" },
    { id: "women'sflyweight", name: "Women's Flyweight" },
  ];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">MMA Rankings</h2>
          <p className="text-gray-400">Official fighter rankings across all weight divisions</p>
        </div>

        <Tabs defaultValue={weightClass} onValueChange={setWeightClass} className="space-y-4">
          <TabsList className="flex flex-nowrap overflow-x-auto pb-2 bg-transparent">
            {weightClasses.map((wc) => (
              <TabsTrigger 
                key={wc.id} 
                value={wc.id} 
                className={`mr-2 whitespace-nowrap ${weightClass === wc.id ? 'bg-primary text-white' : 'bg-secondary-800 text-gray-300'}`}
              >
                {wc.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(rankingsData).map((key) => (
            <TabsContent key={key} value={key}>
              <Card className="bg-secondary-800 border-secondary-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {weightClasses.find(wc => wc.id === key)?.name} Division
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {rankingsData[key].map((fighter, index) => (
                      <div 
                        key={index}
                        className={`flex items-center p-3 rounded-lg ${fighter.isChampion ? 'bg-secondary-700 border border-primary' : index % 2 === 0 ? 'bg-secondary-900' : 'bg-secondary-800'}`}
                      >
                        <div className="flex-shrink-0 w-12 text-center">
                          {fighter.isChampion ? (
                            <div className="flex justify-center">
                              <Trophy className="h-6 w-6 text-primary" />
                            </div>
                          ) : (
                            <span className={`text-lg font-bold ${parseInt(fighter.rank) <= 5 ? 'text-white' : 'text-gray-400'}`}>
                              {fighter.rank}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-grow ml-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h4 className="text-white font-bold">
                                {fighter.name}
                                {fighter.isChampion && (
                                  <Badge variant="outline" className="ml-2 bg-primary text-white border-primary">
                                    Champion
                                  </Badge>
                                )}
                              </h4>
                              <div className="text-sm text-gray-400">{fighter.record}</div>
                            </div>
                            <div className="mt-1 md:mt-0">
                              <span className="text-sm text-gray-500">{fighter.country}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}