import React, { useState, useEffect } from 'react';
import MarsViewer from './components/MarsViewer';
import MissionControl from './components/MissionControl';
import InfoPanel from './components/InfoPanel';
import { Landmark } from './types';
import { getMissionInsight } from './services/geminiService';

const App: React.FC = () => {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Handle Landmark Selection
  const handleSelectLandmark = (landmark: Landmark) => {
    if (selectedLandmark?.id === landmark.id) return;
    
    setSelectedLandmark(landmark);
    setAiInsight(null);
    setIsLoadingAi(true);

    // Call Gemini API for "Data Drop"
    const fetchInsight = async () => {
      const insight = await getMissionInsight(landmark.name, landmark.description);
      setAiInsight(insight);
      setIsLoadingAi(false);
    };
    fetchInsight();
  };

  const handleCloseInfo = () => {
    setSelectedLandmark(null);
    setAiInsight(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-cyan-500 selection:text-black">
      {/* 3D Viewer Layer */}
      <MarsViewer 
        selectedLandmark={selectedLandmark}
        onLandmarkClick={handleSelectLandmark}
      />

      {/* UI Overlay Layer */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Enable pointer events only for UI elements */}
        <div className="pointer-events-auto w-full h-full">
          
          <MissionControl 
            onSelectLandmark={handleSelectLandmark}
            selectedLandmark={selectedLandmark}
          />

          <InfoPanel 
            landmark={selectedLandmark} 
            aiInsight={aiInsight}
            isLoadingAi={isLoadingAi}
            onClose={handleCloseInfo}
          />
          
          {/* Footer / Branding */}
          <div className="absolute bottom-4 left-4 text-cyan-500/50 font-mono text-xs z-30">
            <div>MARS VISUALIZATION SYSTEM V2.0</div>
            <div>STATUS: ONLINE // CONNECTED TO DSN</div>
          </div>
          
          {/* Timeline Overlay (Simulated by Cesium Widget usually, but we can add custom controls here if needed) */}
          <div className="absolute bottom-8 right-12 text-slate-400 text-xs font-mono text-right pointer-events-none">
            <div className="text-2xl font-bold text-cyan-500">SOL 542</div>
            <div>JEZERO CRATER TIME: 14:32:11</div>
          </div>
        </div>
      </div>
      
      {/* Scanline Effect Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20 opacity-20" />
    </div>
  );
};

export default App;