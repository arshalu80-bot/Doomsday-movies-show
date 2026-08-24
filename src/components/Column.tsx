import { ReactNode } from 'react';
import { TrackerItem } from '../types';
import { Check } from 'lucide-react';

interface MovieItemProps {
  item: TrackerItem;
  onToggleWatch: (id: string) => void;
  showOriginBadge?: boolean;
}

function MovieItem({ item, onToggleWatch, showOriginBadge }: MovieItemProps) {
  return (
    <div 
      onClick={() => onToggleWatch(item.id)}
      className={`flex items-center gap-3 p-2 bg-white/5 border rounded cursor-pointer transition-all duration-200 hover:bg-white/10 ${item.watched ? 'opacity-60 border-transparent' : 'border-white/5'}`}
    >
      <div 
        className={`w-4 h-4 flex-shrink-0 border rounded flex items-center justify-center transition-colors ${
          item.watched ? 'bg-current border-current' : 'border-white/30'
        }`}
      >
        {item.watched && <span className="text-[10px] text-white">✓</span>}
      </div>
      
      <span className="text-[10px] font-mono text-[#f3f4f6] opacity-30 min-w-[20px] hidden sm:inline-block">
        {item.originalIndex}
      </span>
      
      <span className={`text-xs text-[#f3f4f6] ${item.watched ? 'line-through' : ''}`}>
        {item.title}
      </span>
      
      {showOriginBadge && (
        <span className="ml-auto text-[8px] text-[#f3f4f6] opacity-50 uppercase">
          {item.category}
        </span>
      )}
    </div>
  );
}

interface ColumnProps {
  title: string;
  count: number;
  countLabel: string;
  items: TrackerItem[];
  colorHex: string;
  onToggleWatch: (id: string) => void;
  showOriginBadge?: boolean;
  emptyMessage?: ReactNode;
}

export function Column({ title, count, countLabel, items, colorHex, onToggleWatch, showOriginBadge, emptyMessage }: ColumnProps) {
  return (
    <section className="flex flex-col bg-[#121621]/80 border-t-4 border-x border-b border-white/10 rounded-lg backdrop-blur-lg h-[60vh] shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ borderTopColor: colorHex }}>
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
        <h2 
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: colorHex }}
        >
          {title}
        </h2>
        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">
          {count} {countLabel}
        </span>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-2 custom-scrollbar">
        {items.length === 0 && emptyMessage ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-500 text-xs p-5 h-full">
            <div>{emptyMessage}</div>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} style={{ color: item.watched && colorHex ? colorHex : undefined }}>
              <MovieItem 
                item={item} 
                onToggleWatch={onToggleWatch} 
                showOriginBadge={showOriginBadge} 
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
