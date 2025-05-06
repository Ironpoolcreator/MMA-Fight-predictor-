import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronRight, Calendar, Search, Trophy, Users, MapPin, Filter } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Sample historical event data
const historicalEvents = [
  {
    id: 1,
    name: "UFC 300",
    date: "April 13, 2025",
    venue: "T-Mobile Arena, Las Vegas",
    mainCard: [
      { fighter1: "Jon Jones", fighter2: "Stipe Miocic", weightClass: "Heavyweight", title: true, result: "Jones by SUB (Round 3)" },
      { fighter1: "Alex Pereira", fighter2: "Jamahal Hill", weightClass: "Light Heavyweight", title: true, result: "Pereira by KO (Round 2)" },
      { fighter1: "Alexa Grasso", fighter2: "Valentina Shevchenko", weightClass: "Women's Flyweight", title: true, result: "Grasso by DEC" },
      { fighter1: "Charles Oliveira", fighter2: "Arman Tsarukyan", weightClass: "Lightweight", title: false, result: "Tsarukyan by DEC" },
      { fighter1: "Sean O'Malley", fighter2: "Merab Dvalishvili", weightClass: "Bantamweight", title: false, result: "O'Malley by KO (Round 1)" }
    ],
    prelimCard: [
      { fighter1: "Dustin Poirier", fighter2: "Michael Chandler", weightClass: "Lightweight", title: false, result: "Poirier by SUB (Round 2)" },
      { fighter1: "Jiri Prochazka", fighter2: "Magomed Ankalaev", weightClass: "Light Heavyweight", title: false, result: "Prochazka by TKO (Round 3)" },
      { fighter1: "Kayla Harrison", fighter2: "Julianna Peña", weightClass: "Women's Bantamweight", title: false, result: "Harrison by DEC" },
      { fighter1: "Bo Nickal", fighter2: "Kevin Holland", weightClass: "Middleweight", title: false, result: "Nickal by SUB (Round 1)" }
    ]
  },
  {
    id: 2,
    name: "UFC 299",
    date: "March 9, 2025",
    venue: "Kaseya Center, Miami",
    mainCard: [
      { fighter1: "Sean O'Malley", fighter2: "Marlon Vera", weightClass: "Bantamweight", title: true, result: "O'Malley by DEC" },
      { fighter1: "Dustin Poirier", fighter2: "Benoit Saint Denis", weightClass: "Lightweight", title: false, result: "Poirier by TKO (Round 2)" },
      { fighter1: "Kevin Holland", fighter2: "Gilbert Burns", weightClass: "Welterweight", title: false, result: "Burns by SUB (Round 1)" },
      { fighter1: "Petr Yan", fighter2: "Song Yadong", weightClass: "Bantamweight", title: false, result: "Yan by DEC" },
      { fighter1: "Katlyn Cerminara", fighter2: "Amanda Ribas", weightClass: "Women's Flyweight", title: false, result: "Cerminara by DEC" }
    ],
    prelimCard: [
      { fighter1: "Curtis Blaydes", fighter2: "Jailton Almeida", weightClass: "Heavyweight", title: false, result: "Blaydes by KO (Round 3)" },
      { fighter1: "Ion Cutelaba", fighter2: "Philipe Lins", weightClass: "Light Heavyweight", title: false, result: "Cutelaba by DEC" },
      { fighter1: "Mateusz Rębecki", fighter2: "Roosevelt Roberts", weightClass: "Lightweight", title: false, result: "Rębecki by TKO (Round 1)" },
      { fighter1: "Michel Pereira", fighter2: "Michal Oleksiejczuk", weightClass: "Middleweight", title: false, result: "Pereira by SUB (Round 1)" }
    ]
  },
  {
    id: 3,
    name: "UFC 298",
    date: "February 17, 2025",
    venue: "Honda Center, Anaheim",
    mainCard: [
      { fighter1: "Ilia Topuria", fighter2: "Alexander Volkanovski", weightClass: "Featherweight", title: true, result: "Topuria by KO (Round 2)" },
      { fighter1: "Robert Whittaker", fighter2: "Paulo Costa", weightClass: "Middleweight", title: false, result: "Whittaker by DEC" },
      { fighter1: "Ian Machado Garry", fighter2: "Geoff Neal", weightClass: "Welterweight", title: false, result: "Garry by DEC" },
      { fighter1: "Merab Dvalishvili", fighter2: "Henry Cejudo", weightClass: "Bantamweight", title: false, result: "Dvalishvili by DEC" },
      { fighter1: "Anthony Hernandez", fighter2: "Roman Kopylov", weightClass: "Middleweight", title: false, result: "Hernandez by SUB (Round 2)" }
    ],
    prelimCard: [
      { fighter1: "Amanda Lemos", fighter2: "Mackenzie Dern", weightClass: "Women's Strawweight", title: false, result: "Lemos by DEC" },
      { fighter1: "Marcos Rogério de Lima", fighter2: "Andrei Arlovski", weightClass: "Heavyweight", title: false, result: "Lima by TKO (Round 1)" },
      { fighter1: "Zhang Mingyang", fighter2: "Brendson Ribeiro", weightClass: "Light Heavyweight", title: false, result: "Zhang by KO (Round 1)" },
      { fighter1: "Josh Quinlan", fighter2: "Danny Barlow", weightClass: "Welterweight", title: false, result: "Barlow by DEC" }
    ]
  },
  {
    id: 4,
    name: "UFC 297",
    date: "January 20, 2025",
    venue: "Scotiabank Arena, Toronto",
    mainCard: [
      { fighter1: "Dricus du Plessis", fighter2: "Sean Strickland", weightClass: "Middleweight", title: true, result: "Du Plessis by DEC" },
      { fighter1: "Raquel Pennington", fighter2: "Mayra Bueno Silva", weightClass: "Women's Bantamweight", title: true, result: "Pennington by DEC" },
      { fighter1: "Neil Magny", fighter2: "Mike Malott", weightClass: "Welterweight", title: false, result: "Magny by TKO (Round 3)" },
      { fighter1: "Chris Curtis", fighter2: "Marc-André Barriault", weightClass: "Middleweight", title: false, result: "Curtis by DEC" },
      { fighter1: "Movsar Evloev", fighter2: "Arnold Allen", weightClass: "Featherweight", title: false, result: "Evloev by DEC" }
    ],
    prelimCard: [
      { fighter1: "Brad Katona", fighter2: "Garrett Armfield", weightClass: "Bantamweight", title: false, result: "Katona by DEC" },
      { fighter1: "Charles Jourdain", fighter2: "Sean Woodson", weightClass: "Featherweight", title: false, result: "Draw" },
      { fighter1: "Serhiy Sidey", fighter2: "Ramon Taveras", weightClass: "Bantamweight", title: false, result: "Sidey by DEC" },
      { fighter1: "Gillian Robertson", fighter2: "Polyana Viana", weightClass: "Women's Strawweight", title: false, result: "Robertson by SUB (Round 2)" }
    ]
  }
];

// Event list component
const EventList = ({ events, onViewEvent }: { events: typeof historicalEvents, onViewEvent: (id: number) => void }) => {
  return (
    <div className="space-y-4">
      {events.map(event => (
        <Card key={event.id} className="hover:border-primary transition-colors cursor-pointer" onClick={() => onViewEvent(event.id)}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{event.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{event.venue}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Fight card component
const FightCard = ({ fight, isMain }: { fight: typeof historicalEvents[0]['mainCard'][0], isMain: boolean }) => {
  return (
    <Card className={cn(
      "mb-3 overflow-hidden border-l-4",
      fight.title ? "border-l-amber-400" : isMain ? "border-l-blue-500" : "border-l-gray-300"
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <p className="font-semibold">{fight.fighter1} vs {fight.fighter2}</p>
              {fight.title && (
                <Badge className="ml-2 bg-amber-500 text-xs py-0 px-2 h-5">
                  Title Fight
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{fight.weightClass}</p>
          </div>
          <Badge className={cn(
            "text-xs h-6",
            fight.result?.includes("KO") ? "bg-red-500" :
            fight.result?.includes("SUB") ? "bg-blue-500" :
            fight.result?.includes("DEC") ? "bg-purple-500" :
            "bg-gray-500"
          )}>
            {fight.result}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default function HistoricalEvents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<typeof historicalEvents[0] | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Filter events based on search, date, and tab
  const filteredEvents = historicalEvents.filter(event => {
    // Filter by search query
    if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by date if selected
    if (selectedDate) {
      const eventDateStr = event.date;
      const [monthName, day, year] = eventDateStr.split(/[ ,]+/);
      const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);
      
      if (monthIndex === -1) return false;
      
      const eventDate = new Date(parseInt(year), monthIndex, parseInt(day));
      
      // Check if the dates match (ignoring time)
      if (
        eventDate.getDate() !== selectedDate.getDate() ||
        eventDate.getMonth() !== selectedDate.getMonth() ||
        eventDate.getFullYear() !== selectedDate.getFullYear()
      ) {
        return false;
      }
    }
    
    // Filter by tab (year)
    if (activeTab !== 'all') {
      const eventYear = event.date.split(', ')[1];
      if (eventYear !== activeTab) {
        return false;
      }
    }
    
    return true;
  });
  
  const handleViewEvent = (id: number) => {
    const event = historicalEvents.find(e => e.id === id);
    if (event) {
      setSelectedEvent(event);
    }
  };
  
  const handleBack = () => {
    setSelectedEvent(null);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDate(undefined);
    setActiveTab('all');
  };
  
  // Get unique years from events for tabs
  const years = Array.from(new Set(historicalEvents.map(event => event.date.split(', ')[1])));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-yellow-500 to-red-500 text-transparent bg-clip-text">
        Historical UFC Events
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Browse past UFC events and fight results
      </p>

      {selectedEvent ? (
        <div className="animate-fadeIn">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={handleBack}
          >
            ← Back to Events
          </Button>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <CardTitle className="text-2xl">{selectedEvent.name}</CardTitle>
              <div className="text-sm text-gray-300 flex flex-col sm:flex-row sm:gap-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center mt-1 sm:mt-0">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{selectedEvent.venue}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                  Main Card
                </h2>
                <div className="space-y-3">
                  {selectedEvent.mainCard.map((fight, index) => (
                    <FightCard key={index} fight={fight} isMain={true} />
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-600" />
                  Preliminary Card
                </h2>
                <div className="space-y-3">
                  {selectedEvent.prelimCard.map((fight, index) => (
                    <FightCard key={index} fight={fight} isMain={false} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by event name"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" onClick={clearFilters} disabled={!searchQuery && !selectedDate && activeTab === 'all'}>
                <Filter className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Events</TabsTrigger>
              {years.sort((a, b) => parseInt(b) - parseInt(a)).map(year => (
                <TabsTrigger key={year} value={year}>{year}</TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {filteredEvents.length > 0 ? (
                <EventList events={filteredEvents} onViewEvent={handleViewEvent} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No events found matching your filters.</p>
                  <Button variant="link" onClick={clearFilters}>Clear filters</Button>
                </div>
              )}
            </TabsContent>
            
            {years.map(year => (
              <TabsContent key={year} value={year} className="mt-0">
                {filteredEvents.length > 0 ? (
                  <EventList events={filteredEvents} onViewEvent={handleViewEvent} />
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No events found matching your filters.</p>
                    <Button variant="link" onClick={clearFilters}>Clear filters</Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
}