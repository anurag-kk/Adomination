import React, { useState, useEffect } from 'react';
import { RoseBackground } from './components/RoseBackground';
import { PollModal } from './components/PollModal';
import { MapVisualization } from './components/MapVisualization';
import { generateAdoFunFact } from './services/adoFacts';

const API_BASE_URL = '/api';

const App: React.FC = () => {
  const [hasVoted, setHasVoted] = useState(() => localStorage.getItem('hasVoted') === 'true');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(() => localStorage.getItem('selectedCountry'));
  const [stats, setStats] = useState<Record<string, number>>({});
  const [funFact, setFunFact] = useState<string>("");
  const [loadingFact, setLoadingFact] = useState(false);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchGlobalStats();
    if (hasVoted && selectedCountry) loadFact();
  }, [hasVoted, selectedCountry]);

  const loadFact = async () => {
    setLoadingFact(true);
    const text = await generateAdoFunFact();
    setFunFact(text);
    setLoadingFact(false);
  };

  const handleVote = async (country: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country }),
      });
      if (!response.ok) throw new Error('Vote failed');
      const updatedStats = await response.json();
      setStats(updatedStats);
      setSelectedCountry(country);
      setHasVoted(true);
      localStorage.setItem('hasVoted', 'true');
      localStorage.setItem('selectedCountry', country);
      loadFact();
    } catch (err) {
      alert("System Error: Could not transmit voice to archives.");
    }
  };

  const handleRePoll = () => {
    localStorage.removeItem('hasVoted');
    localStorage.removeItem('selectedCountry');
    window.location.reload();
  };

  return (
    // CHANGED: Removed h-screen and overflow-hidden to allow scrolling on small devices
    <div className="relative w-full min-h-screen text-white bg-[#050510] selection:bg-rose-500 selection:text-white">
      <RoseBackground />
      
      {/* Header / Brand */}
      {/* CHANGED: Adjusted padding and text size for mobile scaling */}
      <header className="absolute top-0 left-0 z-30 w-full p-4 md:p-6 flex justify-between items-start pointer-events-none">
        <div className="max-w-[70%] md:max-w-none">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-ado font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-rose-500 drop-shadow-[0_0_10px_rgba(255,0,127,0.5)] leading-none">
            ADO WORLD PULSE
          </h1>
          <p className="text-[10px] md:text-xs text-blue-300/50 tracking-[0.2em] md:tracking-[0.3em] font-sans mt-1">GLOBAL REVOLUTION STATISTICS</p>
        </div>
        {hasVoted && (
          <div className="text-right pointer-events-auto">
             <button 
               onClick={handleRePoll}
               className="px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold border border-blue-900/50 text-blue-400 hover:text-rose-400 hover:border-rose-500 transition-colors uppercase tracking-wider bg-black/50 backdrop-blur"
             >
               Re-Poll
             </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      {/* CHANGED: pt-20 for mobile, pt-24 for desktop. Removed h-full. */}
      <main className="relative z-10 w-full flex flex-col pt-20 md:pt-24 pb-6 px-4 md:px-6">
        
        {!hasVoted && <PollModal onVote={handleVote} />}

        {hasVoted && (
          // CHANGED: Flex direction is column by default (mobile) and row on lg screens
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Map Section */}
            {/* CHANGED: Fixed height for mobile to ensure the map remains usable */}
            <div className="w-full lg:flex-1 h-[40vh] sm:h-[50vh] lg:h-[calc(100vh-160px)] animate-[fadeIn_1s_ease-out]">
              <MapVisualization stats={stats} selectedCountry={selectedCountry} />
            </div>

            {/* Info / Stats Panel */}
            <aside className="w-full lg:w-80 flex flex-col gap-6 animate-[slideIn_0.8s_ease-out_0.2s_both]">
              
              {/* Selected Country Card */}
              <div className="p-5 md:p-6 bg-black/60 backdrop-blur-md border-t-2 border-rose-500 rounded-b-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <h2 className="text-[10px] uppercase tracking-widest text-blue-400 mb-2">Your Territory</h2>
                <div className="text-3xl md:text-4xl font-ado font-bold text-white mb-1">{selectedCountry}</div>
                <div className="text-xl md:text-2xl font-mono text-rose-500 mb-4">
                  {(stats[selectedCountry!] || 0).toLocaleString()} <span className="text-sm text-gray-400">Voices</span>
                </div>
                
                {/* Ado Fun Fact */}
                <div className="relative mt-6 pt-6 border-t border-white/10">
                  <div className="absolute -top-3 left-0 px-2 bg-black text-rose-500 text-[10px] font-bold tracking-widest uppercase">
                    ADO ARCHIVES
                  </div>
                  {loadingFact ? (
                    <div className="flex space-x-1 items-center h-12">
                      <div className="w-1 h-4 bg-blue-500 animate-pulse"></div>
                      <div className="w-1 h-6 bg-rose-500 animate-pulse delay-75"></div>
                      <div className="w-1 h-3 bg-purple-500 animate-pulse delay-150"></div>
                      <span className="text-xs text-blue-300 ml-2 animate-pulse">Decrypting...</span>
                    </div>
                  ) : (
                    <p className="text-xs md:text-sm font-mono text-blue-100 leading-relaxed opacity-90">
                      {funFact}
                    </p>
                  )}
                </div>
              </div>

              {/* Global Leaderboard */}
              {/* CHANGED: Fixed height for mobile leaderboard to prevent extreme scrolling */}
              <div className="h-[300px] lg:flex-1 flex flex-col bg-black/40 backdrop-blur border border-blue-900/30 rounded-lg p-4">
                <h3 className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">Top Regions</h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {Object.entries(stats)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .map(([country, count], idx) => (
                      <div key={country} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-[10px] w-4 ${idx < 3 ? 'text-rose-500' : 'text-gray-600'}`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className={`text-xs md:text-sm ${country === selectedCountry ? 'text-white font-bold' : 'text-gray-400 group-hover:text-blue-300'}`}>
                            {country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="h-1 w-12 md:w-16 bg-gray-800 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-gradient-to-r from-blue-600 to-rose-600" 
                               style={{ width: `${Math.min(((count as number) / Math.max(...(Object.values(stats) as number[]))) * 100, 100)}%` }}
                             ></div>
                           </div>
                           <span className="text-[10px] font-mono text-gray-500">{count as number}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;