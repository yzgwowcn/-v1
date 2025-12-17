import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Github, Youtube, Command, X, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchEngine = 'google' | 'baidu' | 'bing' | 'github' | 'bilibili';

const ENGINES: { id: SearchEngine; name: string; icon: React.FC<any>; url: string; color: string }[] = [
  { id: 'google', name: 'Google', icon: Globe, url: 'https://www.google.com/search?q=', color: 'text-blue-500' },
  { id: 'baidu', name: '百度', icon: Search, url: 'https://www.baidu.com/s?wd=', color: 'text-blue-600' },
  { id: 'bing', name: 'Bing', icon: Globe, url: 'https://www.bing.com/search?q=', color: 'text-teal-600' },
  { id: 'github', name: 'GitHub', icon: Github, url: 'https://github.com/search?q=', color: 'text-slate-800' },
  { id: 'bilibili', name: 'Bilibili', icon: Youtube, url: 'https://search.bilibili.com/all?keyword=', color: 'text-pink-400' },
];

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeEngine, setActiveEngine] = useState<SearchEngine>('google');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle Search
  const handleSearch = () => {
    if (!query.trim()) return;
    const engine = ENGINES.find(e => e.id === activeEngine);
    if (engine) {
      window.open(engine.url + encodeURIComponent(query), '_blank');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Cycle through engines
      const currentIndex = ENGINES.findIndex(e => e.id === activeEngine);
      const nextIndex = (currentIndex + 1) % ENGINES.length;
      setActiveEngine(ENGINES[nextIndex].id);
    }
  };

  // Close on click outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentEngineObj = ENGINES.find(e => e.id === activeEngine);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />

      {/* Main Box */}
      <div 
        ref={containerRef}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/40 transform transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        {/* Input Area */}
        <div className="relative flex items-center p-4 border-b border-slate-200/50">
           <div className={`p-2 rounded-lg bg-slate-100 ${currentEngineObj?.color} transition-colors mr-3 shrink-0`}>
              {currentEngineObj && <currentEngineObj.icon size={24} />}
           </div>
           
           <input
             ref={inputRef}
             type="text"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder={`在 ${currentEngineObj?.name} 中搜索...`}
             className="flex-1 bg-transparent text-lg sm:text-xl text-slate-800 placeholder-slate-400 outline-none h-12 min-w-0"
           />

           <div className="flex items-center gap-2 shrink-0">
             {query && (
               <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
             )}
             <button 
                onClick={handleSearch}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
             >
               <ArrowRight size={20} />
             </button>
           </div>
        </div>

        {/* Engine Selectors */}
        <div className="bg-slate-50/80 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
           {/* Mobile: Wrap items to ensure visibility. Desktop: Flex row. */}
           <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
             {ENGINES.map((engine) => (
               <button
                 key={engine.id}
                 onClick={() => { setActiveEngine(engine.id); inputRef.current?.focus(); }}
                 className={`px-3 py-2 sm:py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                   activeEngine === engine.id 
                     ? 'bg-white text-slate-800 shadow-sm ring-1 ring-black/5' 
                     : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'
                 }`}
               >
                 <engine.icon size={14} />
                 {engine.name}
               </button>
             ))}
           </div>
           
           <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400 font-mono px-2 shrink-0">
              <span className="flex items-center gap-1"><kbd className="bg-slate-200 px-1 rounded">Tab</kbd> 切换</span>
              <span className="flex items-center gap-1"><kbd className="bg-slate-200 px-1 rounded">Esc</kbd> 关闭</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;