/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TrackerItem } from './types';
import { rawMCU, rawXMen, rawSeries } from './data';
import { Countdown } from './components/Countdown';
import { Column } from './components/Column';

export default function App() {
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'mcu' | 'watched' | 'xmen' | 'series'>('mcu');

  useEffect(() => {
    const saved = localStorage.getItem('marvel_tracker_state_v2');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      const initialItems: TrackerItem[] = [];
      rawMCU.forEach((title, index) => {
        initialItems.push({ id: `mcu_${index}`, title, category: 'mcu', originalIndex: index + 1, watched: false });
      });
      rawXMen.forEach((title, index) => {
        initialItems.push({ id: `xmen_${index}`, title, category: 'xmen', originalIndex: index + 1, watched: false });
      });
      rawSeries.forEach((title, index) => {
        initialItems.push({ id: `series_${index}`, title, category: 'series', originalIndex: index + 1, watched: false });
      });
      setItems(initialItems);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('marvel_tracker_state_v2', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const toggleWatch = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, watched: !item.watched } : item));
  };

  const mcuItems = items.filter(i => !i.watched && i.category === 'mcu');
  const xmenItems = items.filter(i => !i.watched && i.category === 'xmen');
  const seriesItems = items.filter(i => !i.watched && i.category === 'series');
  const watchedItems = items.filter(i => i.watched);

  if (!isLoaded) return null;

  return (
    <div className="relative min-h-screen text-[#f3f4f6] font-sans flex flex-col overflow-hidden bg-[#07090e] pb-[100px]">
      {/* Background gradients */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 fixed">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-[#00ff88] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-[#ff3344] rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-[900px] mx-auto w-full pt-8 pb-0 px-4 sm:px-6">
        <header className="flex flex-col items-center justify-center pb-4 mb-6">
          <h1 
            className="font-['Orbitron'] text-3xl sm:text-4xl font-black tracking-widest uppercase mb-6"
            style={{ 
              background: "linear-gradient(90deg, #ffffff, #00ff88, #00d2ff)", 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent" 
            }}
          >
            Avengers: Doomsday
          </h1>
          <Countdown />
        </header>

        <main className="flex-1 w-full pb-6 mt-4">
          {activeTab === 'mcu' && (
            <Column 
              title="MCU Timeline (2008-2026)"
              count={mcuItems.length}
              countLabel="Left"
              items={mcuItems}
              colorHex="#ff3344"
              onToggleWatch={toggleWatch}
            />
          )}
          {activeTab === 'watched' && (
            <Column 
              title="Watched / Completed"
              count={watchedItems.length}
              countLabel="Watched"
              items={watchedItems}
              colorHex="#a855f7"
              onToggleWatch={toggleWatch}
              showOriginBadge
              emptyMessage={
                <>No items marked as watched yet.<br/>Click any movie/show to shift it here!</>
              }
            />
          )}
          {activeTab === 'xmen' && (
            <Column 
              title="X-Men Universe"
              count={xmenItems.length}
              countLabel="Left"
              items={xmenItems}
              colorHex="#f5b301"
              onToggleWatch={toggleWatch}
            />
          )}
          {activeTab === 'series' && (
            <Column 
              title="Marvel Series & Shows"
              count={seriesItems.length}
              countLabel="Left"
              items={seriesItems}
              colorHex="#00d2ff"
              onToggleWatch={toggleWatch}
            />
          )}
        </main>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-[15px] left-1/2 -translate-x-1/2 w-[calc(100%-30px)] max-w-[850px] bg-[#0d111a]/95 border border-white/10 rounded-[18px] flex justify-around p-2 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.4)] backdrop-blur-md z-50">
        <button 
          className={`flex-1 bg-transparent border-none flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'mcu' ? 'text-[#ff3344] bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setActiveTab('mcu')}
        >
          <span>Bar 1: MCU</span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{mcuItems.length}</span>
        </button>
        
        <button 
          className={`flex-1 bg-transparent border-none flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'watched' ? 'text-[#a855f7] bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setActiveTab('watched')}
        >
          <span>Bar 2: Watched</span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{watchedItems.length}</span>
        </button>

        <button 
          className={`flex-1 bg-transparent border-none flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'xmen' ? 'text-[#f5b301] bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setActiveTab('xmen')}
        >
          <span>Bar 3: X-Men</span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{xmenItems.length}</span>
        </button>

        <button 
          className={`flex-1 bg-transparent border-none flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'series' ? 'text-[#00d2ff] bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setActiveTab('series')}
        >
          <span>Bar 4: Shows</span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{seriesItems.length}</span>
        </button>
      </nav>
    </div>
  );
}
