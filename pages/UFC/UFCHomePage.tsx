import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import UFCNavbar from '../../components/UFC/UFCNavbar';
import PredictionCard from '../../components/UFC/PredictionCard';
import Footer from '../../components/Footer';
import ViewFullCardModal from '../../components/UFC/ViewFullCardModal';
import FighterPerformanceChart from '../../components/UFC/FighterPerformanceChart';
import UFCEventsList from '../../components/UFC/UFCEventsList';
import UFCCountdownTimer from '../../components/UFC/UFCCountdownTimer';

interface UFCFighter {
  id: number;
  name: string;
  rank: number;
  country: string;
  countryCode: string;
  image: string;
  odds: number;
}

interface Fight {
  id: number;
  weightClass: string;
  fighter1: UFCFighter;
  fighter2: UFCFighter;
}

interface EventData {
  id: string;
  name: string;
  date: string;
  venue: string;
  location: string;
  fights: Fight[];
}

export default function UFCHomePage() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullCardModalOpen, setIsFullCardModalOpen] = useState(false);
  const [selectedFighterForStats, setSelectedFighterForStats] = useState<any>(null);
  
  useEffect(() => {
    // Load fight data directly
    setEvent({
      id: 'ufc-night-apr-26',
      name: 'UFC FIGHT PREDICTOR',
      date: 'APRIL 29, 2025',
      venue: 'AI PREDICTION CENTER',
      location: 'ONLINE',
      fights: [
        {
          id: 1,
          weightClass: 'WELTERWEIGHT BOUT',
          fighter1: {
            id: 101,
            name: 'IAN MACHADO GARRY',
            rank: 7,
            country: 'IRELAND',
            countryCode: 'ie',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-12/GARRY_IAN_L.png?itok=m3QH_1EB',
            odds: -122
          },
          fighter2: {
            id: 102,
            name: 'CARLOS PRATES',
            rank: 13,
            country: 'BRAZIL',
            countryCode: 'br',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-10/PRATES_CARLOS_R.png?itok=DLjvWd-a',
            odds: 102
          }
        },
        {
          id: 2,
          weightClass: 'LIGHTWEIGHT BOUT',
          fighter1: {
            id: 103,
            name: 'BENOIT SAINT DENIS',
            rank: 12,
            country: 'FRANCE',
            countryCode: 'fr',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-06/SAINT-DENIS_BENOIT_L_06-24.png?itok=kbfSORCZ',
            odds: -130
          },
          fighter2: {
            id: 104,
            name: 'DUSTIN POIRIER',
            rank: 3,
            country: 'UNITED STATES',
            countryCode: 'us',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2022-12/POIRIER_DUSTIN_L_BELT_12-10.png?itok=h0NvIRO3',
            odds: 110
          }
        },
        {
          id: 3,
          weightClass: 'MIDDLEWEIGHT BOUT',
          fighter1: {
            id: 105,
            name: 'DRICUS DU PLESSIS',
            rank: 0, // Champion
            country: 'SOUTH AFRICA',
            countryCode: 'za',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/DU_PLESSIS_DRICUS_L_07-08.png?itok=HzcYUi0k',
            odds: -170
          },
          fighter2: {
            id: 106,
            name: 'ISRAEL ADESANYA',
            rank: 1,
            country: 'NIGERIA',
            countryCode: 'ng',
            image: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2022-07/ADESANYA_ISRAEL_L_BELTSYNERGY_07-02.png?itok=Hs60tFTH',
            odds: 150
          }
        }
      ]
    });
    setIsLoading(false);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <UFCNavbar />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : event ? (
        <main>
          {/* PREDICTION SYSTEM AS CENTRAL FEATURE */}
          <section className="bg-black text-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h1 className="text-5xl md:text-6xl font-black uppercase mb-4">AI FIGHT PREDICTOR</h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Our advanced AI analyzes fighter data and predicts UFC fight outcomes with stunning accuracy
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                  <a 
                    href="https://www.ufc.com/watch" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-bold uppercase text-sm tracking-wider transition-colors duration-150"
                  >
                    HOW TO WATCH
                  </a>
                  <button 
                    onClick={() => setIsFullCardModalOpen(true)}
                    className="border border-white text-white hover:bg-white hover:text-black px-8 py-3 font-bold uppercase text-sm tracking-wider transition-colors duration-150"
                  >
                    VIEW FULL CARD
                  </button>
                </div>
                
                {/* Fight Week Countdown Timer */}
                <div className="mt-8">
                  <UFCCountdownTimer 
                    targetDate="2025-05-13T22:00:00" 
                    eventName="UFC 320: DU PLESSIS vs ADESANYA" 
                    className="max-w-2xl mx-auto"
                  />
                </div>
              </div>
              
              {/* Main Featured Prediction - LARGE AND CENTRAL */}
              <div className="max-w-5xl mx-auto bg-gray-900 border border-gray-800 rounded-sm overflow-hidden shadow-lg">
                <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-center">
                  <h2 className="text-2xl font-bold uppercase tracking-wide">FEATURED FIGHT PREDICTION</h2>
                </div>
                
                {/* Full Prediction Card */}
                <PredictionCard 
                  fighter1={{
                    id: event.fights[0].fighter1.id,
                    name: event.fights[0].fighter1.name,
                    record: '13-0-0',
                    division: event.fights[0].weightClass,
                    knockoutWins: '7',
                    submissionWins: '2',
                    decisionWins: '4',
                    strikesLandedPerMin: '4.82',
                    strikingAccuracy: '54%',
                    takedownsLandedPerMatch: '1.5',
                    takedownAccuracy: '45%',
                    takedownDefense: '76%',
                  }}
                  fighter2={{
                    id: event.fights[0].fighter2.id,
                    name: event.fights[0].fighter2.name,
                    record: '14-5-0',
                    division: event.fights[0].weightClass,
                    knockoutWins: '10',
                    submissionWins: '1',
                    decisionWins: '3',
                    strikesLandedPerMin: '4.12',
                    strikingAccuracy: '49%',
                    takedownsLandedPerMatch: '1.0',
                    takedownAccuracy: '38%',
                    takedownDefense: '65%',
                  }}
                  event={event.name}
                  date={event.date}
                  location={event.location}
                  onFighterStatsClick={(fighter) => setSelectedFighterForStats(fighter)}
                />
              </div>
              
              {/* How the AI Works */}
              <div className="mt-16 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">HOW OUR ADVANCED AI WORKS</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Data Collection",
                      description: "Analyzes 1000+ data points including fight history, style, physical attributes, and recent performance."
                    },
                    {
                      title: "Style Analysis",
                      description: "Identifies fighting styles, strengths, weaknesses, and evaluates style matchups between opponents."
                    },
                    {
                      title: "Deep Simulation",
                      description: "Uses neural networks to simulate thousands of fight scenarios and determine likely outcomes."
                    },
                    {
                      title: "Confidence Score",
                      description: "Provides a confidence rating based on consistency of simulation results and available data quality."
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-900 p-6 rounded-sm">
                      <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-bold text-xl mb-4 rounded-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          {/* More Fight Predictions */}
          <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-black text-center mb-10">MORE FIGHT PREDICTIONS</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {event.fights.slice(1).map((fight) => (
                  <div key={fight.id} className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                    {/* Weight Class Header */}
                    <div className="bg-black text-white p-3 text-center">
                      <h3 className="font-bold text-sm tracking-wider">{fight.weightClass}</h3>
                    </div>
                    
                    {/* Fighters */}
                    <div className="grid grid-cols-5 p-4">
                      {/* Fighter 1 */}
                      <div className="col-span-2 text-center">
                        <div 
                          className="h-40 relative mx-auto group cursor-pointer bg-gray-100 flex items-center justify-center"
                          onClick={() => setSelectedFighterForStats({
                            id: fight.fighter1.id,
                            name: fight.fighter1.name,
                            record: '0-0',
                          })}
                        >
                          <div className="text-center">
                            <div className="font-bold text-lg">{fight.fighter1.name}</div>
                            <div className="mt-2 text-sm text-gray-600">
                              {fight.fighter1.country} 
                              {fight.fighter1.odds < 0 ? ` (${fight.fighter1.odds})` : ` (+${fight.fighter1.odds})`}
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-white text-center text-xs">
                              <span className="font-bold">VIEW</span><br />
                              <span>PERFORMANCE</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          {fight.fighter1.rank === 0 ? (
                            <div className="inline-block bg-red-600 text-white text-xs px-1 py-0.5 mt-1 font-bold">C</div>
                          ) : fight.fighter1.rank > 0 ? (
                            <div className="text-xs text-gray-600">#{fight.fighter1.rank}</div>
                          ) : null}
                        </div>
                      </div>
                      
                      {/* VS */}
                      <div className="col-span-1 flex items-center justify-center">
                        <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">VS</div>
                      </div>
                      
                      {/* Fighter 2 */}
                      <div className="col-span-2 text-center">
                        <div 
                          className="h-40 relative mx-auto group cursor-pointer bg-gray-100 flex items-center justify-center"
                          onClick={() => setSelectedFighterForStats({
                            id: fight.fighter2.id,
                            name: fight.fighter2.name,
                            record: '0-0',
                          })}
                        >
                          <div className="text-center">
                            <div className="font-bold text-lg">{fight.fighter2.name}</div>
                            <div className="mt-2 text-sm text-gray-600">
                              {fight.fighter2.country} 
                              {fight.fighter2.odds < 0 ? ` (${fight.fighter2.odds})` : ` (+${fight.fighter2.odds})`}
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-white text-center text-xs">
                              <span className="font-bold">VIEW</span><br />
                              <span>PERFORMANCE</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          {fight.fighter2.rank === 0 ? (
                            <div className="inline-block bg-red-600 text-white text-xs px-1 py-0.5 mt-1 font-bold">C</div>
                          ) : fight.fighter2.rank > 0 ? (
                            <div className="text-xs text-gray-600">#{fight.fighter2.rank}</div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    
                    {/* Get Prediction Button */}
                    <div className="border-t border-gray-200 p-3">
                      <Link href={`/ufc/prediction/${fight.id}`} className="bg-black text-white block text-center py-2 font-bold text-sm uppercase hover:bg-gray-900 transition-colors">
                        Get AI Prediction
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Link href="/ufc/predictions" className="inline-block bg-black text-white font-bold py-3 px-8 uppercase text-sm hover:bg-gray-900 transition-colors">
                  View All Predictions
                </Link>
              </div>
            </div>
          </section>
          
          {/* Enhanced UFC Events Section with Full Card View */}
          <section className="py-12 bg-gradient-to-b from-black to-gray-900 text-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-black text-center mb-8">UPCOMING EVENTS</h2>
              <UFCCountdownTimer 
                targetDate="2025-05-13T22:00:00" 
                eventName="UFC 320: DU PLESSIS vs ADESANYA" 
                className="max-w-3xl mx-auto mb-12"
              />
            </div>
          </section>
          <UFCEventsList />
          
          {/* Social Media Footer */}
          <section className="bg-black text-white py-10">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-xl font-bold mb-6">FOLLOW UFC</h2>
              
              <div className="flex justify-center space-x-6 mb-6">
                <a 
                  href="https://www.instagram.com/ufc/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-white hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://twitter.com/ufc" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-white hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href="https://www.facebook.com/UFC/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-white hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://www.youtube.com/user/UFC" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-white hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              
              <p className="text-sm text-gray-500">
                © 2025 UFC Analytics Platform. All fighter images and content property of UFC.
              </p>
            </div>
          </section>
        </main>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No event data available</p>
        </div>
      )}
      
      <Footer />
      
      {/* Full Card Modal */}
      {event && (
        <ViewFullCardModal
          isOpen={isFullCardModalOpen}
          onClose={() => setIsFullCardModalOpen(false)}
          eventName={event.name}
          eventDate={event.date}
          location={event.location}
          mainCardFights={event.fights}
        />
      )}
      
      {/* Performance Chart Modal */}
      {selectedFighterForStats && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFighterForStats(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl p-4 rounded-sm overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}  
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Fighter Performance</h2>
              <button 
                onClick={() => setSelectedFighterForStats(null)}
                className="text-gray-500 hover:text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black mr-3 bg-gray-200 flex items-center justify-center text-2xl font-bold">
                  {selectedFighterForStats.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedFighterForStats.name}</h3>
                  <div className="text-sm text-gray-600">{selectedFighterForStats.record || 'Record N/A'}</div>
                </div>
              </div>
              
              <FighterPerformanceChart
                fighterName={selectedFighterForStats.name}
                recentFights={[
                  {
                    opponent: "John Smith",
                    result: "W",
                    method: "KO/TKO",
                    round: 2,
                    date: "2024-12-15",
                    strikesLanded: 45,
                    strikesAttempted: 78,
                    takedownsLanded: 2,
                    takedownsAttempted: 5
                  },
                  {
                    opponent: "Mike Johnson",
                    result: "W",
                    method: "Decision",
                    round: 3,
                    date: "2024-09-22",
                    strikesLanded: 87,
                    strikesAttempted: 163,
                    takedownsLanded: 1,
                    takedownsAttempted: 3
                  },
                  {
                    opponent: "Carlos Rodriguez",
                    result: "L",
                    method: "Submission",
                    round: 1,
                    date: "2024-06-08",
                    strikesLanded: 12,
                    strikesAttempted: 24,
                    takedownsLanded: 0,
                    takedownsAttempted: 2
                  },
                  {
                    opponent: "Alex Williams",
                    result: "W",
                    method: "KO/TKO",
                    round: 1,
                    date: "2024-02-17",
                    strikesLanded: 22,
                    strikesAttempted: 35,
                    takedownsLanded: 0,
                    takedownsAttempted: 0
                  },
                  {
                    opponent: "Daniel Thompson",
                    result: "W",
                    method: "Decision",
                    round: 3,
                    date: "2023-11-05",
                    strikesLanded: 78,
                    strikesAttempted: 156,
                    takedownsLanded: 3,
                    takedownsAttempted: 7
                  }
                ]}
              />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-100 p-4">
                  <h4 className="font-bold mb-2 text-sm uppercase">Fight Style Analysis</h4>
                  <p className="text-sm text-gray-700">
                    {selectedFighterForStats.name} is primarily a {Math.random() > 0.5 ? 'striking' : 'grappling'} specialist 
                    with excellent {Math.random() > 0.5 ? 'counter-striking' : 'offensive pressure'} and 
                    {Math.random() > 0.5 ? ' strong takedown defense.' : ' powerful submission threats.'}
                  </p>
                </div>
                <div className="bg-gray-100 p-4">
                  <h4 className="font-bold mb-2 text-sm uppercase">Strengths & Weaknesses</h4>
                  <div className="text-sm">
                    <div className="mb-1"><span className="font-bold text-green-600">+</span> {Math.random() > 0.5 ? 'Striking power' : 'Takedown accuracy'}</div>
                    <div className="mb-1"><span className="font-bold text-green-600">+</span> {Math.random() > 0.5 ? 'Cardio and endurance' : 'Fight IQ'}</div>
                    <div><span className="font-bold text-red-600">-</span> {Math.random() > 0.5 ? 'Submission defense' : 'Counter striking'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}