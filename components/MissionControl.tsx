import React, { useState } from 'react';
import { MARS_LANDMARKS } from '../constants';
import { Landmark } from '../types';
import { Search, Radio, Crosshair, Zap } from 'lucide-react';

interface MissionControlProps {
  onSelectLandmark: (landmark: Landmark) => void;
  selectedLandmark: Landmark | null;
}

const MissionControl: React.FC<MissionControlProps> = ({ onSelectLandmark, selectedLandmark }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'roam' | 'targets'>('targets');

  const filteredLandmarks = MARS_LANDMARKS.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute top-4 left-4 z-40 w-72 flex flex-col gap-4 font-sans">
      {/* Search Header */}
      <div className="bg-slate-900/90 backdrop-blur border border-cyan-500/50 p-1 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center">
        <div className="pl-3 text-cyan-500">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Locate mission targets..."
          className="bg-transparent border-none text-cyan-50 placeholder-cyan-700/50 text-sm w-full focus:ring-0 px-3 py-2 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Control Panel */}
      <div className="bg-slate-900/90 backdrop-blur border-l-2 border-cyan-500 p-4 rounded-r-lg shadow-lg">
        <div className="flex gap-4 mb-4 border-b border-slate-700 pb-2">
          <button 
            onClick={() => setActiveTab('targets')}
            className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${activeTab === 'targets' ? 'text-cyan-400 border-b border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Targets
          </button>
          <button 
            onClick={() => setActiveTab('roam')}
            className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${activeTab === 'roam' ? 'text-cyan-400 border-b border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Telemetry
          </button>
        </div>

        {activeTab === 'targets' ? (
          <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredLandmarks.map((landmark) => (
              <button
                key={landmark.id}
                onClick={() => onSelectLandmark(landmark)}
                className={`w-full text-left p-3 rounded border transition-all duration-200 group relative overflow-hidden ${
                  selectedLandmark?.id === landmark.id 
                    ? 'bg-cyan-900/40 border-cyan-400 text-cyan-100' 
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-cyan-600 hover:text-cyan-200'
                }`}
              >
                <div className="flex items-center justify-between z-10 relative">
                  <div>
                    <div className="font-bold text-sm">{landmark.name}</div>
                    <div className="text-[10px] font-mono opacity-70 mt-0.5">{landmark.type.toUpperCase()}</div>
                  </div>
                  {selectedLandmark?.id === landmark.id && (
                    <Zap size={14} className="text-amber-400 animate-pulse" />
                  )}
                </div>
                {selectedLandmark?.id === landmark.id && (
                  <div className="absolute inset-0 bg-cyan-400/5 animate-[pulse_3s_ease-in-out_infinite]" />
                )}
              </button>
            ))}
            {filteredLandmarks.length === 0 && (
              <div className="text-slate-500 text-xs p-2 text-center italic">No targets found matching telemetry.</div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
             <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
               <div className="flex items-center gap-2 text-cyan-400 mb-2">
                 <Radio size={14} className="animate-pulse"/>
                 <span className="text-xs font-bold">MRO ORBITER</span>
               </div>
               <div className="space-y-1">
                 <div className="flex justify-between text-[10px] text-slate-400">
                    <span>ALTITUDE</span>
                    <span className="font-mono text-cyan-100">~255 KM</span>
                 </div>
                 <div className="flex justify-between text-[10px] text-slate-400">
                    <span>VELOCITY</span>
                    <span className="font-mono text-cyan-100">3.4 KM/S</span>
                 </div>
                 <div className="h-1 w-full bg-slate-700 mt-2 rounded overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[65%] animate-[pulse_2s_infinite]"></div>
                 </div>
               </div>
             </div>

             <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
               <div className="flex items-center gap-2 text-amber-400 mb-2">
                 <Crosshair size={14} />
                 <span className="text-xs font-bold">PERSEVERANCE</span>
               </div>
               <div className="space-y-1">
                 <div className="flex justify-between text-[10px] text-slate-400">
                    <span>STATUS</span>
                    <span className="font-mono text-amber-100">ACTIVE</span>
                 </div>
                 <div className="flex justify-between text-[10px] text-slate-400">
                    <span>SOL</span>
                    <span className="font-mono text-amber-100">1000+</span>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionControl;