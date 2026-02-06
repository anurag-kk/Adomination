import React, { useState } from 'react';
import { COUNTRIES } from '../constants';

interface PollModalProps {
  onVote: (country: string) => void;
}

export const PollModal: React.FC<PollModalProps> = ({ onVote }) => {
  const [selected, setSelected] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      onVote(selected);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-8 overflow-hidden bg-[#0a0a1a] border border-blue-900/50 shadow-[0_0_50px_rgba(0,0,255,0.2)] rounded-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600"></div>
        
        <h1 className="mb-2 text-3xl font-black text-center text-white font-ado tracking-widest uppercase">
          World Pulse
        </h1>
        <p className="mb-8 text-sm text-center text-blue-200/60 font-light tracking-wide">
          WHERE DOES YOUR VOICE RESONATE FROM?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full px-4 py-3 text-blue-100 bg-[#050510] border border-blue-800 rounded focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none appearance-none transition-all duration-300"
              required
            >
              <option value="" disabled>Select your territory</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-[#050510]">
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-blue-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selected}
            className={`w-full py-4 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 
              ${selected 
                ? 'bg-gradient-to-r from-blue-700 to-rose-700 text-white hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] hover:scale-[1.02]' 
                : 'bg-gray-900 text-gray-600 cursor-not-allowed'}`}
          >
            Enter The World
          </button>
        </form>
      </div>
    </div>
  );
};