import React from 'react';
import { Landmark } from '../types';

interface InfoPanelProps {
  landmark: Landmark | null;
  aiInsight: string | null;
  isLoadingAi: boolean;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ landmark, aiInsight, isLoadingAi, onClose }) => {
  if (!landmark) return null;

  return (
    <div className="absolute top-20 right-4 w-80 bg-slate-900/90 border border-cyan-500/50 backdrop-blur-md rounded-lg overflow-hidden text-cyan-50 shadow-[0_0_15px_rgba(6,182,212,0.3)] transform transition-all duration-300 z-50">
      <div className="bg-cyan-950/50 p-3 border-b border-cyan-500/30 flex justify-between items-center">
        <h3 className="font-mono text-lg font-bold text-cyan-400 tracking-wider">
          DATA_LOG: {landmark.name.toUpperCase()}
        </h3>
        <button onClick={onClose} className="text-cyan-600 hover:text-cyan-300">
          ✕
        </button>
      </div>

      <div className="relative h-48 w-full bg-black">
        <img 
          src={landmark.image} 
          alt={landmark.name} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          TYPE: {landmark.type.toUpperCase()}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-xs font-mono text-cyan-600 mb-1">STANDARD DATABASE</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {landmark.description}
          </p>
        </div>

        <div className="border-t border-cyan-900/50 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isLoadingAi ? 'bg-amber-500 animate-pulse' : 'bg-cyan-500'}`}></div>
            <h4 className="text-xs font-mono text-cyan-400">MISSION AI ANALYSIS</h4>
          </div>
          
          <div className="min-h-[60px] bg-slate-950/50 p-3 rounded border border-cyan-900/30 font-mono text-xs text-cyan-100">
            {isLoadingAi ? (
              <span className="animate-pulse">Analyzing terrain telemetry...</span>
            ) : aiInsight ? (
              aiInsight
            ) : (
              <span className="text-slate-500">No telemetry available.</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
          <div className="bg-slate-800/50 p-2 rounded">
            <div className="text-slate-600">LATITUDE</div>
            <div>{landmark.position.lat.toFixed(4)}°</div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded">
            <div className="text-slate-600">LONGITUDE</div>
            <div>{landmark.position.lng.toFixed(4)}°</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;