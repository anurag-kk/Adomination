import React, { useState, useEffect } from 'react';
import { RoseBackground } from './components/RoseBackground';
import { PollModal } from './components/PollModal';
import { MapVisualization } from './components/MapVisualization';
import { INITIAL_STATS } from './constants';
import { generateAdoFunFact } from './services/geminiService';

const App: React.FC = () => {
  // Initialize state from localStorage
  const [hasVoted, setHasVoted] = useState(() => localStorage.getItem('hasVoted') === 'true');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(() => localStorage.getItem('selectedCountry'));
  
  const [stats, setStats] = useState<Record<string, number>>(INITIAL_STATS);
  const [funFact, setFunFact] = useState<string>("");
  const [loadingFact, setLoadingFact] = useState(false);

  // Restore state and fetch data on mount if user already voted
  useEffect(() => {
    if (hasVoted && selectedCountry) {
      // Re-apply the user's vote to the visual stats
      setStats(prev => ({
        ...prev,
        [selectedCountry]: (prev[selectedCountry] || 0) + 1
      }));

      // Fetch the fun fact
      const loadFact = async () => {
        setLoadingFact(true);
        const text = await generateAdoFunFact();
        setFunFact(text);
        setLoadingFact(false);
      };
      loadFact();
    }
  }, []); // Run only once on mount

  // Handle user vote
  const handleVote = async (country: string) => {
    setSelectedCountry(country);
    localStorage.setItem('hasVoted', 'true');
    localStorage.setItem('selectedCountry', country);
    
    // Update local stats (simulate poll backend)
    setStats(prev => ({
      ...prev,
      [country]: (prev[country] || 0) + 1
    }));
    
    setHasVoted(true);

    // Fetch AI fun fact
    setLoadingFact(true);
    const text = await generateAdoFunFact();
    setFunFact(text);
    setLoadingFact(false);
  };

  const handleRePoll = () => {
    localStorage.removeItem('hasVoted');
    localStorage.removeItem('selectedCountry');
    window.location.reload();
  };

  return (
    <div className="relative w-full h-screen text-white bg-[#050510] overflow-hidden selection:bg-rose-500 selection:text-white">
      <RoseBackground />
      
      {/* Header / Brand */}
      <header className="absolute top-0 left-0 z-30 w-full p-6 flex justify-between items-center pointer-events-none">
        <div>
          <h1 className="text-3xl font-ado font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-rose-500 drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]">
            ADO WORLD PULSE
          </h1>
          <p className="text-xs text-blue-300/50 tracking-[0.3em] font-sans mt-1">GLOBAL REVOLUTION STATISTICS</p>
        </div>
        {hasVoted && (
          <div className="text-right pointer-events-auto">
             <button 
               onClick={handleRePoll}
               className="px-4 py-2 text-xs font-bold border border-blue-900/50 text-blue-400 hover:text-rose-400 hover:border-rose-500 transition-colors uppercase tracking-wider bg-black/50 backdrop-blur"
             >
               Re-Poll
             </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full h-full flex flex-col pt-24 pb-6 px-6">
        
        {!hasVoted && <PollModal onVote={handleVote} />}

        {hasVoted && (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full">
            
            {/* Map Section */}
            <div className="flex-1 min-h-[50vh] animate-[fadeIn_1s_ease-out]">
              <MapVisualization stats={stats} selectedCountry={selectedCountry} />
            </div>

            {/* Info / Stats Panel */}
            <aside className="w-full lg:w-80 flex flex-col gap-6 animate-[slideIn_0.8s_ease-out_0.2s_both]">
              
              {/* Selected Country Card */}
              <div className="p-6 bg-black/60 backdrop-blur-md border-t-2 border-rose-500 rounded-b-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <h2 className="text-xs uppercase tracking-widest text-blue-400 mb-2">Your Territory</h2>
                <div className="text-4xl font-ado font-bold text-white mb-1">{selectedCountry}</div>
                <div className="text-2xl font-mono text-rose-500 mb-4">
                  {(stats[selectedCountry!] || 0).toLocaleString()} <span className="text-sm text-gray-400">Voices</span>
                </div>
                
                {/* Ado Fun Fact */}
                <div className="relative mt-6 pt-6 border-t border-white/10">
                  <div className="absolute -top-3 left-0 px-2 bg-black text-rose-500 text-xs font-bold tracking-widest">
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
                    <p className="text-sm font-mono text-blue-100 leading-relaxed opacity-90">
                      {funFact}
                    </p>
                  )}
                </div>
              </div>

              {/* Global Leaderboard */}
              <div className="flex-1 overflow-hidden flex flex-col bg-black/40 backdrop-blur border border-blue-900/30 rounded-lg p-4">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Top Regions</h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {Object.entries(stats)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .map(([country, count], idx) => (
                      <div key={country} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-xs w-4 ${idx < 3 ? 'text-rose-500' : 'text-gray-600'}`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className={`text-sm ${country === selectedCountry ? 'text-white font-bold' : 'text-gray-400 group-hover:text-blue-300'}`}>
                            {country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="h-1 w-16 bg-gray-800 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-gradient-to-r from-blue-600 to-rose-600" 
                               style={{ width: `${Math.min(((count as number) / Math.max(...(Object.values(stats) as number[]))) * 100, 100)}%` }}
                             ></div>
                           </div>
                           <span className="text-xs font-mono text-gray-500">{count as number}</span>
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